from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

url_list = [
	'https://www.hookah-shisha.com/p-4246-starbuzz-hookah-tobacco-flavors-100.html'
]

# Function to get the URL content
def simple_get(url):
	# try to open the url
	try:
		with closing(get(url, stream=True)) as resp:
			return resp.content
	# Return none if error
	except RequestException as e:
		log_error('Error during request')
		return none

# Function to get a list of all flavors
def GetFlavors(request):
	#print(request.option)
	flavors = []
	# Loop through all options
	for i, li in enumerate(request.select('option')):
		flavor = li.text
		# Check if we hit the end of the list
		if (flavor.find('Add $') != -1):
			break
		# Check if contains new wording and remove it, then add to the list
		flavor = flavor.split(' - New')[0]
		flavors.append(flavor)
	return flavors

# Main
for url in url_list:
	pageRequest = simple_get(url)
	page = BeautifulSoup(pageRequest, 'html.parser')
	GetFlavors(page)
