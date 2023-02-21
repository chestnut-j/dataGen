import openai

openai.api_key = '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'
openai.Model.list()


def generate_prompt(cons, origin):
  return """Convert originlist into newlist both satisfying constraints, and keep None no change
   constraints: range from 155.0 to 200.0, type is Real, citrates and count are '>180' and 4
  originlist: [155,155,155,181,181,155,155,155,181,181]
  newlist: [155,175.85,190.31,194.99,160.81,190.26,160.81,173.49,181,169.86]
  constraints: range from 0 to 100, type is Int,  repeat and times are 0 and 2
  originlist: [60,60,60,60,0,0,60,60,60,60]
  newlist: [71,69,62,60,60,62,0,90,0,98]
  constraints: range from 150.0 to 190.0, type is Real,  citrates and count are '>180'and 3,
  originlist: [155,155,155,181,None,155,None,155,181,181]
  newlist:""".format(cons,origin)


cons = "'range': [150.0, 190.0], 'type': 'Real', 'Empty': [2]"
origin = "[155,155,155,181,None,155,None,155,181,181]"
# print(generate_prompt(cons, origin))
response = openai.Completion.create(
    # model="text-curie-001",
    model="text-davinci-003",
    prompt="give me a high dimensional data(6 columns and 10 rows) which contain 3 clusters,without specific cluster content ,and convert it into a python list without data argument, just a list",
    # prompt=generate_prompt(cons, origin),
    temperature=0.2,
    max_tokens=2000,
)
text_data = response.choices[0].text
print(text_data)
data=eval(text_data)
print(data)
# print("response: ", response.choices[0].text)
