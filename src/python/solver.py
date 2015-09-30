import json, random
import numpy as np

def mult(x, y):
    return reduce(lambda agg, x: agg + x,[x * y for (x, y) in zip(x, y)], 0)

def vectorPotential(c):
    g = lambda x: mult(c, x)
    return g

def jugglersInCircuit(circuitIndex, jugglers, x):
    jugglers = [((circuitIndex * jugglers) + i, i) for (i, x) in enumerate(x[circuitIndex * jugglers:(circuitIndex+1) * jugglers]) if (x == 1)]
    return jugglers

def newStateMaker(circuits, jugglers):
    def g(x):
        randCircuit1Index = random.randint(0, circuits - 1)
        randCircuit2Index = random.randint(0, circuits - 1)
        if (randCircuit1Index == randCircuit2Index):
            return x
        randJugglerIndex1 = random.randint(0, float(jugglers)/float(circuits) - 1)
        randJugglerIndex2 = random.randint(0, float(jugglers)/float(circuits) - 1)
        jugglersInCircuit1 = jugglersInCircuit(randCircuit1Index, jugglers, x)
        jugglersInCircuit2 = jugglersInCircuit(randCircuit2Index, jugglers, x)
        (leavingIndex1, juggler1) = jugglersInCircuit1[randJugglerIndex1]
        (leavingIndex2, juggler2) = jugglersInCircuit2[randJugglerIndex2]
        x[leavingIndex1] = 0
        x[leavingIndex2] = 0
        x[(randCircuit1Index * jugglers) + juggler2] = 1
        x[(randCircuit2Index * jugglers) + juggler1] = 1
        return x
    return g



class SimulatedAnnealing():
    def simulate(nsteps, T, V, changeStep, state, generateNewState, gamma):
        for step in range(nsteps):
            if step == changeStep:
                T *= ( 1 - gamma )
            newState = generateNewState(state)
            transitionOdds = math.exp( - ( V(newState) - V(state)  ) / T)
            if random.uniform(0.0, 1.0) < transitionOdds:
                state = newState
        return T, state

if (__name__ == "__main__"):
    bFile = open("./data/B.json")
    bMat = json.load(bFile)
    cFile = open("./data/C.json")
    cMat = json.load(cFile)

    nColsA = bMat[2] * bMat[0]

    C = np.zeros((1, nColsA))

    #Load up C
    for x in cMat:
        C[0, x[0]] = x[1]

    x = np.zeros((1, nColsA))

    #Load up x

    randomState = newStateMaker(bMat[0], bMat[1])

    simulationInstance = SimulatedAnnealing()
    minimized = simulationInstance.simulate(10^9, 10^8, vectorPotential(C), 1000, x, randomState, 100)

    resultFile = open('./data/X.json', 'w')
    json.dump(minimized.tolist(), resultFile)

    resultFile.close
    bFile.close
    cFile.close
