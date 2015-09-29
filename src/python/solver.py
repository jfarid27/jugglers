import json
from scipy import sparse
import numpy
import cvxpy as cvx

def vectorPotential(c):
    g = lambda x: c * x
    return g

class SimulatedAnnealing():
    def simulate(nsteps, T, V, changeStep, state, generateNewState, gamma):
        for step in nsteps:
            if (step == changeStep):
                T = T - gamma
            newState = generateNewState(state)
            transitionOdds = math.exp( - ( V(newState) - V(state)  ) / T)
            if random.uniform(0, 1) < transitionOdds:
                state = newState
        return state

if (__name__ == "__main__"):
    bFile = open("./data/B.json")
    bMat = json.load(bFile)
    cFile = open("./data/C.json")
    cMat = json.load(cFile)

    nRowsA = 2 * bMat[2] + bMat[0]
    nColsA = bMat[2] * bMat[0]

    C = sparse.lil_matrix((1, nColsA))

    #Load up C
    for x in cMat:
        C[0, x[0]] = x[1]

    x = sparse.lil_matrix((1, nColsA))

    simulationInstance = SimulatedAnnealing()
    minimized = simulationInstance.simulate(10^9, 10^8, vectorPotential, 1000, x, randomState, 100)

    resultFile = open('./data/X.json', 'w')
    json.dump(minimized.tolist(), resultFile)
    
    resultFile.close
    bFile.close
    cFile.close
