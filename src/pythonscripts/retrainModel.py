import sys,json
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_selection import SelectFromModel
from sklearn import tree

from sklearn import metrics
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix

# For using SMOTE 
from imblearn.over_sampling import SMOTE

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()
    filePath = './src/datasets/csv/' + data["filename"]
    data = pd.read_csv(filePath,header = 0)
    data.drop(['Unnamed: 0'],axis = 1, inplace = True)
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
    
    #print(selectedFeatures)
    #print(filePath)

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

    #decision Tree
    model_dtree = tree.DecisionTreeClassifier(max_depth = 5)
    model_dtree.fit(x_train_res, y_train_res)
    prediction = model_dtree.predict(test_x)

    result = {
        "features" : features,
        "Model" : "Decision Tree",
        "Accuracy" : metrics.accuracy_score(prediction,test_y),
        "Recall" : recall_score(test_y, prediction, average='macro'),
        "F1" : f1_score(test_y, prediction, average='macro')
    }

    print(json.dumps(result))

# Start process
if __name__ == '__main__':
    main()

