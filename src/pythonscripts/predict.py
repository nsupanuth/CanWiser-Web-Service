import sys,json
from sklearn.externals import joblib

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()
    model = joblib.load('./src/pythonscripts/predictiveModels/model_dtree.pkl')
    #userPredict = model.predict([[21.46,94.25,0.09444,0.09947,0.2075]])
    userPredict = model.predict([[data["gammaGT"],data["alkPhosphatase"],data["ALT"],data["CEA"],data["CA199"]]])
    print(userPredict[0])

# Start process
if __name__ == '__main__':
    main()
