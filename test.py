import os

for root, dirs, files in os.walk('./app/src'):
    for file in files:
        print(os.path.join(root, file))
