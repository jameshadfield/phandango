#!/usr/bin/env python

import sys
import pdb

def returnCollapsedLine(line):
    fields = splitLine(line)
    for idx in range(11, len(fields)):
        if fields[idx] == '':
            fields[idx] = ''
        else:
            fields[idx] = '1'
    return ','.join(fields)

def splitLine(line):
    fields = line.strip().split(',"')
    for idx in xrange(0, len(fields)):
        fields[idx] = fields[idx].translate(None, '",')
    return fields

firstLine = True
with open(sys.argv[1], "rU") as fhi:
    with open(sys.argv[2],'w') as fho:
        for line in fhi:
            if firstLine:
                firstLine = False
                fho.write(','.join(splitLine(line)) + "\n");
            else:
                fho.write(returnCollapsedLine(line)+"\n")

