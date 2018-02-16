import sys,json
import warnings
import time

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_selection import SelectFromModel

from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn import tree

from sklearn import metrics
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix

from sklearn.externals import joblib

# For using SMOTE 
from imblearn.over_sampling import SMOTE

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()
    filePath = './src/datasets/csv/' + data["filename"]
    data = pd.read_csv(filePath,header = 0)

    age_0_15_non_cholan = len(data[(data["Age"] >=0) & (data["Age"] <= 15) & (data["Cholan"] == 0)])
    age_0_15_cholan = len(data[(data["Age"] >=0) & (data["Age"] <= 15) & (data["Cholan"] == 1)])

    age_16_30_non_cholan = len(data[(data["Age"] >=16) & (data["Age"] <= 30) & (data["Cholan"] == 0)])
    age_16_30_cholan = len(data[(data["Age"] >=16) & (data["Age"] <= 30) & (data["Cholan"] == 1)])

    age_31_50_non_cholan = len(data[(data["Age"] >=31) & (data["Age"] <= 50) & (data["Cholan"] == 0)])
    age_31_50_cholan = len(data[(data["Age"] >=31) & (data["Age"] <= 50) & (data["Cholan"] == 1)])

    age_51_70_non_cholan = len(data[(data["Age"] >=51) & (data["Age"] <= 70) & (data["Cholan"] == 0)])
    age_51_70_cholan = len(data[(data["Age"] >=51) & (data["Age"] <= 70) & (data["Cholan"] == 1)])

    age_70_plus_non_cholan = len(data[(data["Age"] >=70) & (data["Cholan"] == 0)])
    age_70_plus_cholan = len(data[(data["Age"] >=70) & (data["Cholan"] == 1)])

    num_of_male = len(data[(data["Gender"] == 1) & (data["Cholan"] == 1)])
    num_of_female = len(data[(data["Gender"] == 2) & (data["Cholan"] == 1)])

    #data.drop(['Unnamed: 0'],axis = 1, inplace = True)
    features = list(data.columns[2:])
    data.drop(['Patient_No'],axis = 1, inplace = True)
    
    train_x = data[features]
    train_y = data.Cholan

    # Feature Selection
    clf = ExtraTreesClassifier()
    clf = clf.fit(train_x,train_y)

    # Information Gain
    ig = clf.feature_importances_
    count = 0
    selectedFeatures = list()
    for feature in clf.feature_importances_:
        if feature > 0.1:
            selectedFeatures.append(features[count])
        count = count + 1

    # Classification Model
    features = selectedFeatures
    dataCholan = data[data['Cholan'] == 1]
    dataNonCholan = data[data['Cholan'] == 0]
    cholan_test, cholan_smote = train_test_split(dataCholan,test_size = 0.7)
    non_cholan_smote , non_cholan_test = train_test_split(dataNonCholan,test_size = 0.3)

    dataSmote = cholan_smote.append(non_cholan_smote)
    dataTest = cholan_test.append(non_cholan_test)

    train_x = dataSmote[features]
    train_y = dataSmote.Cholan
    test_x = dataTest[features]
    test_y = dataTest.Cholan

    sm = SMOTE(random_state=12,k_neighbors = 5)
    x_train_res, y_train_res = sm.fit_sample(train_x, train_y)

    #Decision Tree
    model_dtree = tree.DecisionTreeClassifier(max_depth = 5)
    model_dtree.fit(x_train_res, y_train_res)
    prediction__dtree = model_dtree.predict(test_x)
    f1_dtree = f1_score(test_y, prediction__dtree, average='macro')

    
    #Random forest
    model_rdf =RandomForestClassifier(n_estimators=500, max_depth=7)
    model_rdf.fit(x_train_res,y_train_res)
    prediction_rdf = model_rdf.predict(test_x)
    f1_rdf = f1_score(test_y, prediction_rdf, average='macro')

    # Model Selection
    f1 = 0
    selectedModelName = ''
    selectedModel = ''
    if f1_dtree > f1:
        f1 = f1_dtree
        prediction = prediction__dtree
        selectedModelName = 'Decision Tree'
        selectedModel = model_dtree
    if f1_rdf > f1 :
        f1 = f1_rdf
        prediction = prediction_rdf
        selectedModelName = 'Random forest'
        selectedModel = model_rdf

    #warnings.filterwarnings('ignore')

    result = {
        "filePath" : filePath,
        "features" : features,
        "modelName" : selectedModelName,
        "modelPath" : './src/predictivemodels/'+selectedModelName+'_'+time.strftime("%Y-%m-%d %H:%M")+'.pkl',
        "accuracy" : metrics.accuracy_score(prediction,test_y),
        "recall" : recall_score(test_y, prediction, average='macro'),
        "f1" : f1_score(test_y, prediction, average='macro'),
        "dashboard" : {
            "age_0_15_non_cholan" :  age_0_15_non_cholan,
            "age_0_15_cholan" : age_0_15_cholan,
            "age_16_30_non_cholan" : age_16_30_non_cholan,
            "age_16_30_cholan" : age_16_30_cholan,
            "age_31_50_non_cholan" : age_31_50_non_cholan,
            "age_31_50_cholan" : age_31_50_cholan,
            "age_51_70_non_cholan" : age_51_70_non_cholan,
            "age_51_70_cholan" : age_51_70_cholan,
            "age_70_plus_non_cholan" : age_70_plus_non_cholan,
            "age_70_plus_cholan" : age_70_plus_cholan,
            "num_of_male" : num_of_male,
            "num_of_female" : num_of_female
        },
        "stat" : [
            {
                "name" : "mean",
                "age" : data['Age'].mean(),
                "BMI" : data['BMI'].mean(),
                "GammaGT" : data['GammaGT'].mean(),
                "AlkPhosphatase" : data['Alk.Phosphatase'].mean(),
                "ALT" : data['ALT'].mean(),
                "CEA" : data['CEA'].mean(),
                "CA199" : data['CA199'].mean()
            },
            {
                "name" : "median",
                "age" : data['Age'].median(),
                "BMI" : data['BMI'].median(),
                "GammaGT" : data['GammaGT'].median(),
                "AlkPhosphatase" : data['Alk.Phosphatase'].median(),
                "ALT" : data['ALT'].median(),
                "CEA" : data['CEA'].median(),
                "CA199" : data['CA199'].median()
            },
            {
                "name" : "max",
                "age" : data['Age'].max(),
                "BMI" : data['BMI'].max(),
                "GammaGT" : data['GammaGT'].max(),
                "AlkPhosphatase" : data['Alk.Phosphatase'].max(),
                "ALT" : data['ALT'].max(),
                "CEA" : data['CEA'].max(),
                "CA199" : data['CA199'].max()
            },
            {
                "name" : "min",
                "age" : data['Age'].min(),
                "BMI" : data['BMI'].min(),
                "GammaGT" : data['GammaGT'].min(),
                "AlkPhosphatase" : data['Alk.Phosphatase'].min(),
                "ALT" : data['ALT'].min(),
                "CEA" : data['CEA'].min(),
                "CA199" : data['CA199'].min()
            }
           
        ]
        
    
    }

    joblib.dump(selectedModel,result["modelPath"], compress=9)

    print(json.dumps(result))

# Start process
if __name__ == '__main__':
    main()

