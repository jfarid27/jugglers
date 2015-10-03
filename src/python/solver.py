import json, random, math
import numpy as np

def mult(x, y):
    s = [x * y for (x, y) in zip(x, y)]
    return reduce(lambda agg, x: (agg + x), s, 0)

def vectorPotential(c):
    g = lambda x: mult(c[0], x[0])
    return g

def jugglersInCircuit(circuitIndex, jugglers, x):
    jugglers = [((circuitIndex * jugglers) + i, i) for (i, x) in enumerate(x[0, circuitIndex * jugglers:(circuitIndex+1) * jugglers]) if (x == 1)]
    return jugglers

def newStateMaker(circuits, jugglers, juggsPerCircuit, debug=False):
    def g(x):
        randCircuit1Index = random.randint(0, circuits - 1)
        randCircuit2Index = random.randint(0, circuits - 1)
        if (randCircuit1Index == randCircuit2Index):
            return x
        jugglersInCircuit1 = jugglersInCircuit(randCircuit1Index, jugglers, x)
        jugglersInCircuit2 = jugglersInCircuit(randCircuit2Index, jugglers, x)
        randJugglerIndex1 = random.randint(0, juggsPerCircuit - 1)
        randJugglerIndex2 = random.randint(0, juggsPerCircuit - 1)

        (leavingIndex1, juggler1) = jugglersInCircuit1[randJugglerIndex1]
        (leavingIndex2, juggler2) = jugglersInCircuit2[randJugglerIndex2]
        y = np.array(x)
        y[0, leavingIndex1] = 0
        y[0, leavingIndex2] = 0
        y[0, (randCircuit1Index * juggs) + juggler2] = 1
        y[0, (randCircuit2Index * juggs) + juggler1] = 1
        return y
    return g

class SimulatedAnnealing():
    def simulate(self, nsteps, T, V, changeStep, state, generateNewState, gamma, debug=False):
        step = 1
        while step < nsteps:

            if (step % changeStep == 0):
                T *= ( 1 - gamma )
            newState = generateNewState(state)
            transitionOdds = math.exp( - ( V(newState) - V(state)  ) / T)
            if (debug and (step % 100000 == 0)):
                print step, T, V(state), transitionOdds
            if random.uniform(0.0, 1.0) < transitionOdds:
                state = newState
            step += 1
        return T, state

if (__name__ == "__main__"):
    bFile = open("./data/B.json")
    bMat = json.load(bFile)
    cFile = open("./data/C.json")
    cMat = json.load(cFile)

    circuits = bMat[0]
    juggsPerCircuit = bMat[1]
    juggs = bMat[2]
    nColsA = juggs * circuits

    C = np.full((1, nColsA), 100)

    #Load up C
    for i in cMat:
        C[0, i[0]] = i[1]

    x = np.zeros((1, nColsA))

    #Load up x
    for i in range(circuits):
        for j in range(juggsPerCircuit):
            x[0, ((i*juggs) + (j + (i * juggsPerCircuit)))] = 1

    randomState = newStateMaker(circuits, juggs, juggsPerCircuit)


    print vectorPotential(C)(x)
    simulationInstance = SimulatedAnnealing()
    steps = 1000000
    temp = 4
    scheduledDrop = 1000
    deltaTemp = 2 ** -7
    finalTemp, result = simulationInstance.simulate(steps, temp, vectorPotential(C), scheduledDrop, x, randomState, deltaTemp)
    print vectorPotential(C)(result) # Final energy
    print finalTemp
    resultFile = open('./data/X.json', 'w')
    json.dump(result[0].tolist(), resultFile)

    resultFile.close
    bFile.close
    cFile.close
