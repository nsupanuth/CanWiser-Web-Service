import sys,json
import numpy as np
import pandas as pd

def main():
    data = pd.read_csv('./src/datasets/csv/Final_mixed_data.csv',header=0)

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

    num_of_male = len(data[data['Gender'] == 1])
    num_of_female = len(data[data['Gender'] == 0])

    result = {
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
    }

    print(json.dumps(result))


# Start process
if __name__ == '__main__':
    main()
