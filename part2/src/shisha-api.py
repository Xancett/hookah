import json

shisha_data = {}

# Gets the file and loads into shisha_data
def GetFile():
	# This will be updated later to read from the S3 bucket containing the json file
	f = open('part2/flavors.json')
	shisha_data = json.load(f)
	print(shisha_data)

# Main
GetFile()
#print(shisha_data)