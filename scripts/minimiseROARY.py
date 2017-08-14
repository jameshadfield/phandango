#!/usr/bin/env python
import sys
import pdb
import argparse

def collect_args():
    parser = argparse.ArgumentParser(description = "Minimise a ROARY csv file")
    parser.add_argument('-i', '--fileIn', type = str, required = True, help='Path to ROARY CSV file (required)')
    parser.add_argument('-o', '--fileOut', type = str, required = True, help='Output path (minimised ROARY CSV) (required)')
    return parser.parse_args()

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

def main():
    args = collect_args()
    firstLine = True
    with open(args.fileIn, "rU") as fhi:
        with open(args.fileOut,'w') as fho:
            for line in fhi:
                if firstLine:
                    firstLine = False
                    fho.write(','.join(splitLine(line)) + "\n");
                else:
                    fho.write(returnCollapsedLine(line) + "\n")

if __name__== "__main__":
    main()
