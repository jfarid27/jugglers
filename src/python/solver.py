import json
from scipy import sparse
import cvxpy as cvx

if (__name__ == "__main__"):
    aFile = open("./data/A.json")
    aMat = json.load(aFile)
    bFile = open("./data/B.json")
    bMat = json.load(bFile)
    cFile = open("./data/C.json")
    cMat = json.load(cFile)

    nRowsA = bMat[2] + bMat[0]
    nColsA = bMat[2] * bMat[0]

    A = sparse.lil_matrix((nRowsA, nColsA))
    B = sparse.lil_matrix((nRowsA, 1))
    C = sparse.lil_matrix((1, nColsA))

    #Load up A
    for x in aMat:
        A[x[0], x[1]] = x[2]

    #Load up B circuit constraints
    hold = 0
    while (hold < bMat[0]):
        B[hold] = bMat[1] #Jugglers per circuits
        hold += 1

    #Load up B juggler constraints
    hold = bMat[1]
    while (hold < nRowsA):
        B[hold, 0] = 1
        hold += 1

    #Load up C
    for x in cMat:
        C[0, x[0]] = x[1]

    Ac = A.tocsr()
    Ac.set_shape((nRowsA, nColsA))
    Bc = B.tocsc()
    Bc.set_shape((nRowsA, 1))
    Cc = C.tocsc()
    Cc.set_shape((1, nColsA))

    x = cvx.Variable(nColsA)
    objective = cvx.Minimize(cvx.sum_entries(Cc*x))
    constraints = [0 <= x, x <= 1, (Ac*x) == Bc]
    prob = cvx.Problem(objective, constraints)
    print "Optimal value", prob.solve()

    resultFile = open('./data/X.json', 'w')
    json.dump(x.value.tolist(), resultFile)
    resultFile.close

    problemStatusFile = open("./data/status.json", "w")
    status = {"status": prob.status, "value": prob.value}
    json.dump(status, problemStatusFile)
    problemStatusFile.close

    aFile.close
    bFile.close
    cFile.close
