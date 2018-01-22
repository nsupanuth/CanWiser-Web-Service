import sys,json
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_selection import SelectFromModel

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
    
    print(selectedFeatures)
    #print(filePath)

# Start process
if __name__ == '__main__':
    main()

