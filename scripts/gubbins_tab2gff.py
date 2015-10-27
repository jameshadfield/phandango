#!/usr/bin/env python
import pdb
import argparse
import re,sys,os,string

# (c) James Hadfield (jh22@sanger.ac.uk)
# see https://github.com/jameshadfield/JScandy

def get_user_options():
	parser = argparse.ArgumentParser(description="Convert (old) gubbins tab file output to the (new) gff3 format for use in JScandy.")
	parser.add_argument('-t', required=True, action='store', dest="tabfile", help="Gubbins tab file", metavar="FILE")
	parser.add_argument('-l', required=True, action='store', dest="len", help="genome length", metavar="INT")
	return parser.parse_args()

def generate_blocks_from_lines(text): ## generator
	"""the string "misc_feature" seperates the block. returns (yields) list of lines."""
	buff = []
	for line in text:
		if 'misc_feature' in line and buff!=[]:
			if buff:
				yield buff
				buff = [line]
		else:
			buff.append(line)
	if buff:
		yield buff

def sanity_check(tabfile):
	# pdb.set_trace()
	if tabfile[-4:] != ".tab":
		print "FATAL: input file not \".tab\""
		sys.exit(2)
	outfile = tabfile[0:-4]+".gff"
	if os.path.isfile(outfile):
		print "FATAL: output file {} exists!".format(outfile)
		sys.exit(2)
	if not options.len.isdigit():
		print "FATAL: you need a genome length using numbers only!"
		sys.exit(2)

def parse_block(block):
	"""turns list of lines (i.e. block) into hash of salient features"""
	ret = {}
	def _x1x2parser(line):
		r = re.compile(r"(\d+)\.\.(\d+)")
		m = r.findall(line)
		if len(m) == 1:
			return ( int(m[0][0]) , int(m[0][1]) )
		else:
			return ( int(m[0][0]) , int(m[-1][1]) )
	ret['x1'],ret['x2'] = _x1x2parser(block[0])
	nodeLine = next(line for line in block if "taxa" in line)
	ret['node'] = nodeLine.strip().split('"')[1].strip()
	taxaLine = next(line for line in block if "taxa" in line)
	ret['taxa'] = [x.strip() for x in taxaLine.strip().split('"')[1].strip().split(',')]
	snpLine = next(line for line in block if "SNP_count" in line)
	ret['snps'] = snpLine.strip().split('=')[1].strip('"')
	nllLine = next(line for line in block if "neg_log_likelihood" in line)
	ret['nll'] = nllLine.strip().split('=')[1].strip('"')
	return ret

def make_gff3_line(data):
	return "SEQUENCE\tGUBBINS\tCDS\t{}\t{}\t0.000\t.\t0\tnode=\"{}\";neg_log_likelihood=\"{}\";taxa=\"{}\";snp_count=\"{}\"".format(data['x1'],data['x2'],data['node'],data['nll']," ".join(data['taxa']),data['snps'])

if __name__ == "__main__":
	options = get_user_options()
	sanity_check(options.tabfile)

	outfile = options.tabfile[0:-4]+".gff"
	with open(outfile,'w') as fho:
		fho.write("##gff-version 3\n##sequence-region SEQUENCE 1 {}\n".format(options.len))
		with open(options.tabfile,'rU') as fhi:
			for block in generate_blocks_from_lines(fhi):
				fho.write(make_gff3_line(parse_block(block))+"\n")












