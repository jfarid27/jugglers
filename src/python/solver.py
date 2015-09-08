import json
from scipy.optimize import linprog

if (__name__ == "__main__"):

    aFile = open("./data/A.json")
    aMat = json.load(aFile)
    bFile = open("./data/B.json")
    bMat = json.load(bFile)
    cFile = open("./data/C.json")
    cMat = json.load(cFile)

    res = linprog(cMat, A_eq=aMat, b_eq=bMat, bounds=(0,1), {maxIter=1000000})

    resultFile = open('./data/X.json', 'w')
    json.dump(res.x.tolist(), resultFile)
    resultFile.close
    aFile.close
    bFile.close
    cFile.close
