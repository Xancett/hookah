from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

data_list = {
	"Starbuzz": 'https://www.hookahwholesalers.com/p-4107-Wholesale-Starbuzz-Shisha-Tobacco.html',
	"Fumari": 'https://www.hookahwholesalers.com/p-4700-fumari-100g-shisha-tobacco.html',
	"Social Smoke": 'https://www.hookahwholesalers.com/p-5597-social-smoke-100g-tin.html',
	"Ugly Shisha": 'https://www.hookahwholesalers.com/p-16508-ugly-shisha-tobacco.html',
	"Haze": 'https://www.hookahwholesalers.com/p-17570-haze-shisha-tobacco-250.html',
	"Trifecta Blonde": 'https://www.hookahwholesalers.com/p-16409-trifecta-shisha-tobacco.html',
	"Trifecta Dark Leaf": 'https://www.hookahwholesalers.com/p-16397-trifecta-dark-leaf-shisha-tobacco.html'
}
url_list = [
	'https://www.hookahwholesalers.com/p-4107-Wholesale-Starbuzz-Shisha-Tobacco.html'
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


# Function to get the description for each flavor
def GetDescriptions(request):
	descriptions = request.find_all("div", {"class": "pcShowProductSDesc"})
	closingtime = descriptions[0].find_all("br")
	#print(len(closingtime))
	#print(closingtime[2].previous_element.previous_element.text)
	#print(closingtime[0].next_element.find("h2"))
	for option in closingtime:
		if (option.next_element.name != "h2" and option.previous_element.name != "h2"):
			flavor = option.previous_element.previous_element.text
			description = ""
			seperatorList = ["-", "  ", chr(150)]
			seperator = "-"
			for i in seperatorList:
				if (flavor.find(i) != -1):
					seperator = i
					break
			#seperator = "-" if flavor.find("-") != -1 else "  "
			#seperator = "  " if flavor.find("  ") != -1 else "–"
			if (flavor.find(seperator) == -1):
				continue
			description = str(flavor.split(seperator)[1])
			flavor = str(flavor.split(seperator)[0])
			print("Flavor: ", flavor)
			print("Description: ", description)
	return

# Main
for url in url_list:
	pageRequest = simple_get(url)
	page = BeautifulSoup(pageRequest, 'html.parser')
	#GetFlavors(page)
	GetDescriptions(page)
