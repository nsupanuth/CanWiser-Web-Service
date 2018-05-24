import sys,json
from sklearn.externals import joblib

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()
    modelPath = data["modelResult"]["model_path"]
    features = data["modelResult"]["features"]
    #print features

    model = joblib.load(modelPath)
    height = data["predictData"]["height"]
    BMI = data["predictData"]["weight"]/((height/100)*(height/100))

    len_feature = len(features)
    i = 0
    automated_list = list()
    for i in range(len_feature):
        #print(features[i])
        if features[i] == 'Age':
            automated_list.append(data["predictData"]["age"])
        elif features[i] == 'BMI':
            automated_list.append(BMI)
        elif features[i] == 'phy6_2_5_vs1':
            automated_list.append(data["predictData"]["phy6_2_5_vs1"])
        elif features[i] == 'phy6_2_12_vs1':
            automated_list.append(data["predictData"]["phy6_2_12_vs1"])
        elif features[i] == 'phy9_3_6_vs1':
            automated_list.append(data["predictData"]["phy9_3_6_vs1"])
        elif features[i] == 'phy2_5_vs1':
            automated_list.append(data["predictData"]["phy2_5_vs1"])
        elif features[i] == 'phy8_1_3_vs1':
            automated_list.append(data["predictData"]["phy8_1_3_vs1"])
        elif features[i] == 'phy5_5_vs1':
            automated_list.append(data["predictData"]["phy5_5_vs1"])
        elif features[i] == 'GammaGT':
            automated_list.append(data["predictData"]["gammaGT"])
        elif features[i] == 'Alk.Phosphatase':
            automated_list.append(data["predictData"]["alkPhosphatase"])
        elif features[i] == 'ALT':
            automated_list.append(data["predictData"]["ALT"])
        elif features[i] == 'CEA':
            automated_list.append(data["predictData"]["CEA"])
        elif features[i] == 'CA199':
            automated_list.append(data["predictData"]["CA199"])    
        i += 1  

    #print automated_list
    ## Prediction ##
    userPredict = model.predict([automated_list])
    proba = model.predict_proba([automated_list])
    result = {
        "cholan" : userPredict[0],
        "proba" : proba[0][1]
    }

    print(json.dumps(result))

# Start process
if __name__ == '__main__':
    main()    