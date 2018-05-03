import numpy as np
import pandas as pd
import sys,json

from sklearn.cluster import KMeans

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    js_data = read_in()
    data = pd.read_csv('./src/datasets/csv/Final_mixed_data.csv',header=0)
    # For test running python #
    #data = pd.read_csv('../datasets/csv/Final_mixed_data.csv',header=0)
    features = ['Gender','Age','BMI','phy6_2_5_vs1','phy6_2_12_vs1','phy9_3_6_vs1','phy2_5_vs1','phy8_1_3_vs1','phy5_5_vs1']
    data_noncholan = data[data["Cholan"] != 1]  
    data_noncholan = data_noncholan.reset_index()
    data_kmean = data_noncholan[features]  

    #### kmean model ####
    kmeans_model = KMeans(n_clusters=3, random_state=0).fit(data_kmean)
    kmeans_dataframe = pd.DataFrame(kmeans_model.fit_predict(data_kmean))    
    result = pd.concat([data_kmean, kmeans_dataframe], axis=1, join='inner')
    data_result = result.rename(index=str, columns={0: "cluster"}) 

    #### prediction part ####

    #predict_result = kmeans_model.predict([[1,37,25.4,1,0,1,20,1,0]])[0]

    predict_result = kmeans_model.predict([[
                                            js_data["gender"],
                                            js_data["age"],
                                            js_data["BMI"],
                                            js_data["phy6_2_5_vs1"],
                                            js_data["phy6_2_12_vs1"],
                                            js_data["phy9_3_6_vs1"],
                                            js_data["phy2_5_vs1"],
                                            js_data["phy8_1_3_vs1"],
                                            js_data["phy5_5_vs1"]
                                        ]])[0] 

    df_recommend = data_result[data_result["cluster"] == predict_result].sample(n=2)
    json_recommend = df_recommend.to_json(orient='records')
    
    print(json_recommend)

# Start process
if __name__ == '__main__':
    main()