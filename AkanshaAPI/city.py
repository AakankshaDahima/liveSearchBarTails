 
import json
 
# Opening JSON file

def search_city(search_query):
    f = open('city_names.json')
 
    # returns JSON object as
    # a dictionary
    data = json.load(f)
    # print (data)
    post_code_city_list = []## first fill city with postal code
    simple_city_list = []  #then fill city with city name
    for idx in data:
        city_name ,post_code=  idx['city_name'],idx['postcode']
        if search_query in post_code:
            post_code_city_list.append(city_name)
        if search_query.lower() in city_name.lower():
            if city_name.lower() not in post_code_city_list:
                simple_city_list.append(city_name)
    return post_code_city_list+simple_city_list, len(data)
print (search_city("sr"))

