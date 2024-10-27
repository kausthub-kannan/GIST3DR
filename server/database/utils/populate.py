import pandas as pd
import random
from faker import Faker


def populate_patient_details(NUMBER_OF_DATA):
    fake = Faker()
    df = pd.DataFrame()
    for i in range(NUMBER_OF_DATA):
        name = fake.name()
        age = random.randint(1, 80)
        bone_density_gram_per_cm3 = random.uniform(100, 150)
        height_millimeter = random.uniform(100, 500)
        width_millimeter = random.uniform(100, 500)
        thickness_millimeter = random.uniform(100, 200)
        area_millimeter = random.uniform(10000, 50000)

        df = df._append(
            {
                "name": name,
                "age": age,
                "bone_density_gram_per_cm3": bone_density_gram_per_cm3,
                "height_millimeter": height_millimeter,
                "width_millimeter": width_millimeter,
                "thickness_millimeter": thickness_millimeter,
                "area_millimeter": area_millimeter,
            },
            ignore_index=True,
        )

    df.to_csv("patient_details.csv", index=False)


def populate_user_details(NUMBER_OF_DATA):
    fake = Faker()
    df = pd.DataFrame()
    grade_arr = ["Junior", "Senior", "Resident"]
    for i in range(NUMBER_OF_DATA):
        name = fake.name()
        grade = random.choice(grade_arr)
        email = fake.email()

        df = df._append(
            {"name": name, "grade": grade, "email": email}, ignore_index=True
        )

    df.to_csv("user_details.csv", index=False)


if __name__ == "__main__":
    NUMBER_OF_DATA = 5
    populate_user_details(NUMBER_OF_DATA)
    print("Data populated successfully")
