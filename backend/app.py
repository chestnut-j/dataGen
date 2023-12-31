# =================================================================
from itertools import product
import z3
import pandas as pd
import json
import numpy as np
from faker import Faker
import openai
import time

# add your own api key
# openai.api_key = ''
openai.api_key = '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'

fake = Faker()
global output_option_list 
output_option_list ={}

# ================================parse=============================
def findPosi(allStr, findStr):
  posiList = []
  findPosi = False
  findOption = False
  if allStr.find(findStr) != -1:
      posiList.append(allStr.find(findStr))
      findOption = True
      findPosi = allStr.find(findStr) + 1
  while(findOption):
      if allStr.find(findStr, findPosi) != -1:
          posiList.append(allStr.find(findStr, findPosi))
          findPosi = allStr.find(findStr, findPosi) + 1
      else:
          findOption = False
          
  return posiList

def optionSoluntion(optionList):
  optionResult = []
  for option in product(*optionList):
      tempList = []
      for i in option:
          tempList.append(i)
      optionResult.append(tempList)
  return optionResult

def calculateSlotParenthesis(frontParenthesisList, backParenthesisList, inverse=False):
  slotParenthesis = 0
  if inverse:
    for position in range(0, len(backParenthesisList)):
      if frontParenthesisList[len(frontParenthesisList)-1-position] < backParenthesisList[len(backParenthesisList)-1-position]:
        slotParenthesis+=1
      else:
        break
  else:
    for position in range(0, len(frontParenthesisList)):
      if frontParenthesisList[position] < backParenthesisList[position]:
        slotParenthesis+=1
      else:
        break
  return slotParenthesis

def generateSlot(constraintList):
  count = 0
  slotContentList = []
  tempSlotContent = []
  slotJson = ""
  isOnlyOption = True
  for constraintStr in constraintList:
    frontParenthesisList = findPosi(constraintStr, '(')
    backParenthesisList = findPosi(constraintStr, ')')

    if len(frontParenthesisList) > len(backParenthesisList):
        slotParenthesis = calculateSlotParenthesis(frontParenthesisList, backParenthesisList, True)
        slotStart = frontParenthesisList[-(slotParenthesis+1)]
        tempSlotContent.append(constraintStr[slotStart + 1:])
        slotJson += constraintStr[:slotStart]
        slotJson += "{"
        
    elif len(frontParenthesisList) == len(backParenthesisList):
        if count==0: 
          slotParenthesis = 0
          slotJson += "{"
        else:
          slotParenthesis = calculateSlotParenthesis(frontParenthesisList, backParenthesisList)

        isOnlyOption = True
        for position in range(0, len(frontParenthesisList)):
            if frontParenthesisList[position] > backParenthesisList[position]:
                isOnlyOption = False
                break
        if isOnlyOption:
            tempSlotContent.append(constraintStr)
        else:
            slotEnd = backParenthesisList[slotParenthesis]
            tempSlotContent.append(constraintStr[:slotEnd])
            slotContentList.append(tempSlotContent)
            slotJson += "}"
            tempSlotContent = []
            if len(frontParenthesisList) - len(backParenthesisList) + slotParenthesis > 0:
                slotParenthesis = calculateSlotParenthesis(frontParenthesisList, backParenthesisList, True)

                slotStart = frontParenthesisList[-(slotParenthesis+1)]
                slotJson += constraintStr[slotEnd + 1:slotStart]
                tempSlotContent.append(constraintStr[slotStart + 1:])
                slotJson += "{"
            else:
                slotJson += constraintStr[slotEnd + 1:]
            
    else:
        slotParenthesis = calculateSlotParenthesis(frontParenthesisList, backParenthesisList)
        slotEnd = backParenthesisList[slotParenthesis]
        tempSlotContent.append(constraintStr[:slotEnd])
        slotContentList.append(tempSlotContent)
        slotJson += "}"
        slotJson += constraintStr[slotEnd + 1:]
        tempSlotContent = []
        
    count += 1

  frontSlotList = findPosi(slotJson, '{')
  backSlotList = findPosi(slotJson, '}')
  if len(tempSlotContent):
    slotContentList.append(tempSlotContent)
  if len(frontSlotList)>len(backSlotList):
    slotJson += "}"
  # print(slotJson, slotContentList)
  return [slotJson, slotContentList]    

def isOuterrontParenthesis(constraint):
  if constraint[0] == '(' and constraint[len(constraint)-1] == ')':
    constraint = constraint[1:len(constraint)-1]
    
    frontParenthesisList = findPosi(constraint, '(')
    backParenthesisList = findPosi(constraint, ')')
    for position in range(0, len(backParenthesisList)):
      if frontParenthesisList[position] > backParenthesisList[position]:
        return False
    return True
  else:
    return False

def parseConstraint(rawConstraint, key):

    constraint = rawConstraint.replace("),",")|")
    # constraint = rawConstraint

    if constraint.find('Set') == -1:
      if isOuterrontParenthesis(constraint):
        constraint = constraint[1:len(constraint)-1]
      return [constraint]
  
    posList = findPosi(constraint, "Set")
    print(posList)
    slotContentList=[]
    slotJson = ''
    index = 0
    for pos in posList:
      leftCnt = 0
      rightCnt = 0
      slotJson = slotJson+constraint[index:pos]+'{'

      index = pos+3
      while leftCnt==0 or leftCnt!=rightCnt:
        if constraint[index]=='(':
          leftCnt=leftCnt+1
        elif constraint[index]==')':
          rightCnt=rightCnt+1
        index = index+1
      slotJson = slotJson+"}"
      setCons = constraint[pos+4:index-1]
      slotContentList.append(setCons.split('|'))
    slotJson = slotJson+constraint[index:]

    optionResult = optionSoluntion(slotContentList)
    output_option_list[key] = slotContentList
    
    finalJsonList = []
    for ri in optionResult:
        finalJsonList.append(slotJson.format(*ri))
        
    return finalJsonList

def findConstrain(allStr, operation):
    # constraint = allStr.replace(" ","")
    constraint = allStr
    if isOuterrontParenthesis(constraint):
        constraint = constraint[1:len(constraint)-1]
    opList = findPosi(constraint, operation)
    opLen = len(operation)
    constraintList = []
    for i in range(0, len(opList)):
        if i == 0 and len(opList) == 1:
            constraintList.append(constraint[0:opList[i]])
            constraintList.append(constraint[opList[i] + opLen:])
        elif i == 0 and len(opList) != 1:
            constraintList.append(constraint[0:opList[i]])
        elif i == len(opList) - 1:
            constraintList.append(constraint[opList[i-1] + opLen: opList[i]])
            constraintList.append(constraint[opList[i] + opLen:])
        else:
            constraintList.append(constraint[opList[i-1] + opLen: opList[i]])
    return constraintList

# =============================================================================

# =============================constraints mapping=========================================
def parseCons(cons, col):
  # parse type
  if ['Int','Real','String'].count(cons.replace(' ',''))>0:
    col['type'] = cons.replace(' ','')
  
  if cons.find('Int')!= -1:
    col['type'] = 'Int'
  elif cons.find('Real')!= -1:
    col['type'] = 'Real'
  elif cons.find('String')!= -1:
    col['type'] = 'String'

  if cons.find('Range')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['range'] = [eval(x) for x in args]
    if isinstance(col['range'][0],float) or isinstance(col['range'][1],float):
      if 'type' not in col: 
        col['type'] = 'Real'
    elif isinstance(col['range'][0],int) or isinstance(col['range'][1],int):
      if 'type' not in col: 
        col['type'] = 'Int'
  
  if cons.find('Quantile')!=-1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['quantile'] = [eval(x) for x in args]
    if isinstance(col['quantile'][1] ,float) and 'type' not in col:
      col['type'] = 'Real'
    elif isinstance(col['quantile'][1],int) and 'type' not in col: 
      col['type'] = 'Int'

  
  if cons.find('Max')!= -1 or cons.find('Min')!= -1 or cons.find('Sum')!= -1 or cons.find('Mean')!= -1 or cons.find('Var')!= -1 or cons.find('Std')!= -1  :
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    cons_name = cons[:cons.find('(')].lower().replace(" ","")
    col[cons_name] = eval(args[0])
    if isinstance(col[cons_name] ,float) and 'type' not in col:
      col['type'] = 'Real'
    elif isinstance(col[cons_name],int) and 'type' not in col:
      col['type'] = 'Int'
  

  if cons.find('Repeat')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    cons_name = cons[:cons.find('(')].lower().replace(" ","")
    if cons_name in col:
      col[cons_name] = col[cons_name] + [eval(x) for x in args]
    else:
      col[cons_name] = [eval(x) for x in args]
    
    for i in range(int(len(col[cons_name])/2)):
      content = col[cons_name][2*i]
      if isinstance(content,float) and 'type' not in col:
        col['type'] = 'Real'
        break
      elif isinstance(content,int) and 'type' not in col:
        col['type'] = 'Int'
      elif isinstance(content,str) and 'type' not in col:
        col['type'] = 'String'
        break

  if cons.find('Switch')!= -1 :
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    cons_name = cons[:cons.find('(')].lower().replace(" ","")
    col[cons_name] = [eval(x) for x in args]
  
  if cons.find('If')!= -1 and cons.find('FreqIf')== -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    cons_name = cons[:cons.find('(')].lower().replace(" ","")
    col[cons_name] = [eval(x) for x in args]

  if cons.find('FreqIf')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    if 'freqIf' in col:
      col['freqIf'] = col['freqIf'] + [eval(x) for x in args]
    else:
      col['freqIf'] = [eval(x) for x in args]

  if cons.find('Empty')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['empty'] = eval(args[0]) 

  if cons.find('Distinct')!= -1:
    col['distinct'] = True

  if cons.find('Random')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].replace("'","\'")
    col['random'] = "random={}".format(args[1:-1])

  if cons.find('Sequence')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')]
    col['sequence'] = "sequence, {}".format(args[1:-1])

def generate_code_prompt(semantics, length):
  return "length={}, {}".format(length, semantics)

def handler(signum, frame):
    raise TimeoutError("Timeout")

def get_code(semantics, length):
  time.sleep(30)
  openai.Model.list()
  system_content="""You are a python code master. 
      You will help me deal with list generation tasks.
      Once I give you a description about a list,
      You output the python code that can generate the list.
      The list is named by 'result'. 
      Do not write any explanation. Do not write example usage. Do not forget to import libs."""
  # try:
  response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": system_content},
          {"role": "user", "content": generate_code_prompt(semantics, length)},
      ],
  )
  print(response,len(response.choices))
  if len(response.choices)>0:
      text_block = response.choices[0].message.content.split("```")
      if len(text_block) >= 3:
          return "#" + text_block[1]
      else:
          return text_block[0]
  else:
      return None

def solve_gpt_code(semantics, length):
  code = get_code(semantics, length)
  print(code)
  # global result
  data = {"result": []}
  exec(code, data)
  
  return data['result']

# parse json 
def parseJson(origin):
  allTables = []

  for format in origin:
    test = []
    value_test = []
    key_test = []

    test = parseConstraint(format['table'],'table')
    for col_key, col_value in format['columns'].items():
      value_test.append(parseConstraint(col_value, col_key))
      key_test.append(col_key)
    valueList = []
    valueList = product(*value_test)

    for value_op in valueList:
      for op in test:
        parseFormat = []
        item = {}
        valueFormat = {}
        for i in range(len(key_test)):
          valueFormat[key_test[i]] = value_op[i] 
        item = {
          "table": op,
          "columns": valueFormat
        }
        parseFormat.append(item)
        allTables.append(parseFormat)
  return allTables

# parse single table
def parseTable(allTables):
  tables = []
  for table in allTables:
    tableParse = []
    for element in table:
      # for key,value in element.items():
        key = element['table']
        value = element['columns']
        format = {
          'children': []
        }
        # parse key
        constrainList = findConstrain(key, 'And')
        for cons in constrainList:
          if cons.find('nRows') != -1:
            arg = cons[cons.find('(')+1:cons.find(')')]
            format['length'] = int(arg)
          if cons.find('nCols') != -1:
            arg = cons[cons.find('(')+1:cons.find(')')]
            format['column'] = int(arg)
          if cons.find('Order') != -1:
            args = cons[cons.find('(')+1:cons.find(')')].split(',')
            format['order'] = [eval(arg) for arg in args]
          if cons.find('Trend'):
            arg = cons[cons.find('(')+1:cons.find(')')]
            dis_type = cons[cons.find('$')+1:cons.find('Trend')]
            for child in format['children']:
              if child['name'] == arg:
                child['trend'] = dis_type
        # parse children
        i=0
        for col_key, col_value in value.items():
          i = i+1
          if i>format['column']:
            continue
          col = {}
          col['name'] = col_key
          
          consList = findConstrain(col_value, 'And')
          for cons in consList:
            if ['Int','Real','String','Date'].count(cons.replace(" ",""))>0:
              col['type'] = cons.replace(" ","")
          if len(consList) == 0:
            consList.append(col_value)
          for cons in consList:
              parseCons(cons, col)
          # if 'type' not in col:
          #   col['type'] = 'Real'
          format['children'].append(col)
        
        # others columns
        if(len(value.items())<format['column']):
          for i in range(format['column']-len(value.items())):
            col = {}
            col['name'] = 'col'+str(len(value.items())+i+1)
            format['children'].append(col)
        tableParse.append(format)
    tables.append(tableParse)

  return tables



def buildSolver(format):
  num_len = format['length']
  columns = format['children']
  col_size = format['column']
  
  d = {}
  others = {}
  solver = z3.Solver()

  for col in columns:
    special_value = 0
    special_index = []
    random_list = []
    empty_index = []
    nonempty_index = range(num_len)

    #define type
    if 'type' in col:
      col_type = col['type'] 
      if col_type == 'Int':
        d[col['name']] = [z3.Int(f"{col['name']}_{i}") for i in range(num_len)]
      if col_type == 'Real':
        d[col['name']] = [z3.Real(f"{col['name']}_{i}") for i in range(num_len)]
      if col_type == 'String':
        d[col['name']] = [z3.String(f"{col['name']}_{i}") for i in range(num_len)]
    else:
      d[col['name']] = [z3.Real(f"{col['name']}_{i}") for i in range(num_len)]

    if 'type' not in col and 'random' not in col and 'sequence' not in col:
      col['type'] = 'Real'

    # generator
    if 'random' in col:
      print(col['random'])
      random_list = solve_gpt_code(col['random'],num_len)
      others[col['name']]=random_list
      print(random_list)
    elif 'sequence' in col:
      random_list = solve_gpt_code(col['sequence'],num_len)
      others[col['name']]=random_list
    elif col['type'] == 'String':
      random_list = [fake.pystr() for i in range(3*num_len)]
    elif col['type'] == 'Int' or col['type'] == 'Real':
      if 'range' in col:
        col_range = col['range']
        random_list = np.random.uniform(col_range[0],col_range[1], 3*num_len)
      else:
        random_list = np.random.uniform(0, 500, 3*num_len)

    unselected_index = np.arange(num_len)
    
    
    if 'empty' in col:
      times = col['empty']
      special_value += times
      empty_index = np.random.choice(unselected_index, times, replace=False)
      col['empty_index'] = empty_index
      unselected_index = [elem for elem in unselected_index if elem not in empty_index]
      nonempty_index = [elem for elem in range(num_len) if elem not in empty_index]
      print(col)

    if 'max' in col:
      value = col['max']
      if 'range' in col and col['range'][1]>value:
        col['range'][1] = value
      else:
        col['range'] = [0,value]
      max_index = np.random.choice(unselected_index, 1, replace=False)[0]
      special_value += 1
      unselected_index = [elem for elem in unselected_index if elem != max_index]
      max_c = z3.And(
        z3.And([d[col['name']][i]<=d[col['name']][max_index] for i in unselected_index]),
        d[col['name']][max_index]==value)
      solver.add(max_c)

    if 'min' in col:
      value = col['min']
      if 'range' in col and col['range'][0]<value:
        col['range'][0] = value
      else:
        col['range'] = [value,max(100,num_len)]
      min_index = np.random.choice(unselected_index, 1, replace=False)[0]
      special_value += 1
      unselected_index = [elem for elem in unselected_index if elem != min_index]
      min_c = z3.And(z3.And([d[col['name']][i]<=d[col['name']][min_index] for i in unselected_index]),d[col['name']][min_index]==value)
      solver.add(min_c)

    if 'sum' in col:
      value = col['sum']
      sum_c = z3.Sum([d[col['name']][i] for i in nonempty_index]) == value
      solver.add(sum_c)

    if 'mean' in col:
      value = col['mean']
      mean_c = z3.Sum([d[col['name']][i] for i in nonempty_index]) == value*len(nonempty_index)
      solver.add(mean_c)
    
    if 'var' in col:
      value = col['var']
      avg = z3.Sum([d[col['name']][i] for i in nonempty_index])/len(nonempty_index)
      var_c = z3.Sum([(d[col['name']][i]-avg)**2 for i in nonempty_index]) == len(nonempty_index)*value
      solver.add(var_c)
    
    if 'std' in col:
      value = col['std']
      avg = z3.Sum([d[col['name']][i] for i in nonempty_index])/len(nonempty_index)
      std_c = z3.Sum([(d[col['name']][i]-avg)**2 for i in nonempty_index])/len(nonempty_index) == value*value
      solver.add(std_c)
    
    if 'quantile' in col:
      pos = col['quantile'][0]
      value = col['quantile'][1]
      quan_len = len(nonempty_index)*pos//100
      if len(nonempty_index)%2:
        special_index = np.random.choice(unselected_index, 1, replace=False)[0]
        special_value += 1
        unselected_index = [elem for elem in unselected_index if elem != special_index]
        quan_c = z3.And(
                    z3.Sum([d[col['name']][i]<value for i in nonempty_index])==quan_len,
                    d[col['name']][special_index]==value
                  )
      else:
        special_index = np.random.choice(unselected_index, 2, replace=False)
        special_value += 2
        unselected_index = [elem for elem in unselected_index if elem not in special_index]
        quan_c = z3.And(
                    z3.Sum([d[col['name']][i]<value-1 for i in nonempty_index])==quan_len-2,
                    z3.Sum([d[col['name']][i]>value+1 for i in nonempty_index])==len(nonempty_index)-quan_len-2,
                    d[col['name']][special_index[0]]==value-1,
                    d[col['name']][special_index[1]]==value+1
                  )
      solver.add(quan_c)
        
    #define repeat
    if 'repeat' in col:
      if len(col['repeat'])==1:
        times = col['repeat'][0]
        special_value += times
        repeat_index = np.random.choice(unselected_index, times, replace=False)
        repeat_c = z3.And([d[col['name']][i]==d[col['name']][repeat_index[0]] for i in repeat_index])

        solver.add(repeat_c)

        unselected_index = [elem for elem in unselected_index if elem not in repeat_index]
      else:
        for i in range(int(len(col['repeat'])/2)):
          content = col['repeat'][2*i]
          times = col['repeat'][2*i+1]
          special_value += times
          
          repeat_c = z3.Sum([d[col['name']][i]==content for i in unselected_index]) == times
          solver.add(repeat_c)
    
    #define frequency
    if 'freqIf' in col:
      for i in range(int(len(col['freqIf'])/2)):
        content = col['freqIf'][2*i]
        times = col['freqIf'][2*i+1]
        special_value += int(num_len * times)
        freqIf_c = z3.Sum([eval('m'+content,{'m': d[col['name']][i]}) for i in unselected_index]) == int(num_len * times)
        solver.add(freqIf_c)

    #define switch
    if 'switch' in col:
      con_name = col['switch'][0]
      conditions = col['switch'][1:]
      for i in range(int(len(conditions)/2)):
        ifvalue = conditions[2*i]
        value = conditions[2*i+1]
        # print(con_name,ifvalue,value)
        # print(d[con_name])
        special_value += 1
        if con_name in others:
          switch_c = [z3.Or(z3.And(others[con_name][i]==ifvalue, d[col['name']][i]==value),others[con_name][i]!=ifvalue) for i in unselected_index]
        else:
          switch_c = [z3.Or(z3.And(d[con_name][i]==ifvalue, d[col['name']][i]==value),d[con_name][i]!=ifvalue) for i in unselected_index]
        # print(content_c)
        solver.add(switch_c)
    
    #define if
    if 'if' in col:
      con_name = col['if'][0]
      ifvalue = col['if'][1]
      value = col['if'][2]
      if len(col['if'])>3:
        else_value = col['if'][3]
        # print(con_name,ifvalue,value)
        # print(d[con_name])
      # special_value += 1
      if con_name in others:
        if len(col['if'])>3:
          if_c = [z3.Or(z3.And(others[con_name][i]==ifvalue, d[col['name']][i]==value),
                z3.And(others[con_name][i]!=ifvalue, d[col['name']][i]==else_value)) for i in unselected_index]
        else:
          if_c = [z3.Or(z3.And(others[con_name][i]==ifvalue, d[col['name']][i]==value),others[con_name][i]!=ifvalue) for i in unselected_index]  
      else:
        if len(col['if'])>3:
          if_c = [z3.Or(z3.And(d[con_name][i]==ifvalue, d[col['name']][i]==value),
                z3.And(d[con_name][i]!=ifvalue, d[col['name']][i]==else_value)) for i in unselected_index]
        else:
          if_c = [z3.Or(z3.And(d[con_name][i]==ifvalue, d[col['name']][i]==value),d[con_name][i]!=ifvalue) for i in unselected_index] 
      solver.add(if_c)
    
    if 'repeat' in col:
      distinct_c = z3.Distinct([d[col['name']][i] for i in unselected_index])
      solver.add(distinct_c)

    
    #define distinct
    if 'distinct' in col:
      col_distinct = col['distinct']
      if col_distinct == True:
        distinct_c = z3.Distinct([d[col['name']][i] for i in unselected_index])
        solver.add(distinct_c)

    #define range
    random_num = num_len - special_value
    temp_len = int(1.3*num_len)
    if 'range' in col:
      col_range = col['range']
      if col_type == 'Int' or col_type == 'Real':
        range_c = [z3.And(d[col['name']][i]>=col_range[0], d[col['name']][i]<=col_range[1])  for i in nonempty_index]
        solver.add(range_c) 

    if len(col.keys())<=3 and 'random' in col:
      continue

    # random
    if 'type' in col and (col['type']=='Int' or col['type']=='Real' or col['type']=='String') and 'trend' not in col and 'correlation' not in col and 'enum' not in col and 'if' not in col:
      # print(random_num,random_list)
      # random_c = z3.Sum([d[col['name']][i] == random_list[i] for i in unselected_index]) == random_num
      if col['type']=='Int':
        # sample_pool = np.random.choice(random_list,num_len, replace=False)
        # random_c = [[d[col['name']][i] == int(sample_pool[i])] for i in unselected_index]
        random_c = z3.Sum([z3.Or([d[col['name']][i] == int(temp) for temp in np.random.choice(random_list,5, replace=False)]) for i in unselected_index]) == random_num
      elif col['type']=='Real':
        random_c = z3.Sum([z3.Or([d[col['name']][i] == round(temp,8) for temp in np.random.choice(random_list,5, replace=False)]) for i in unselected_index]) == random_num
      else:
        random_c = z3.Sum([z3.Or([d[col['name']][i] == temp for temp in np.random.choice(random_list,3, replace=False)]) for i in unselected_index]) == random_num
      solver.add(random_c)
      
  return [solver, d, others]
# ==========================================================

# ====================data generation==================================
def dataGen(json):
  origin = json
  allTables = parseJson(origin)
  tables = parseTable(allTables)
  AllRes = []
  response_data = []
  sort_config = []
  for index in range(len(tables)):
    response_item = {}
    response_item['origin']=allTables[index]
    response_item['config']=tables[index]
    
    table = tables[index]

    print('========  soving table '+str(index)+'  ========')
    print(table)
    res = []
    for format in table:
      # testCode
      try:
        [solver, d, others] = buildSolver(format)
      except Exception as e:
        print(e)

      num_len = format['length']
      columns = format['children']
      col_size = format['column']
      if 'order' in format:
        sort_config = format['order']
      else:
        sort_config = []
      
      output = []
      cnt = 0
      # testCode
      while solver.check()!=z3.sat and cnt<10:
        print('try :', cnt)
        [solver, d, others] = buildSolver(format)
        cnt+=1

      # testCode
      if solver.check()==z3.sat:
        m = solver.model()
      # if True:
        #json list mode [{a:1,b:2},{a:2},{b:2}...]
        for i in range(num_len):
          data = {}

          # testCode
          for col in columns:
            if len(col.keys())<=3 and 'random' in col:
              data[col['name']] = others[col['name']][i]
              continue
            if 'type' in col:
              if col['type'] == 'Int':
                data[col['name']] = None if 'empty_index' in col and list(col['empty_index']).count(i)>0 else m[d[col['name']][i]].as_long()
                # data[col['name']] = None if m[d[col['name']][i]].as_long() == 999999 else m[d[col['name']][i]].as_long()
              elif col['type'] == 'Real':
                if 'empty_index' in col and list(col['empty_index']).count(i)>0:
                  data[col['name']] = None
                else:
                  data[col['name']] = float(m[d[col['name']][i]].numerator_as_long())/float(m[d[col['name']][i]].denominator_as_long())  
              elif col['type'] == 'String':
                data[col['name']] = None if 'empty_index' in col and list(col['empty_index']).count(i)>0 else eval(str(m[d[col['name']][i]]))[0:4]
              elif col['type'] == 'Date':
                if i < len(others[col['name']]):
                  data[col['name']] = others[col['name']][i]
                else:
                  data[col['name']] = ''
              elif col['type'] == 'Faker' or col['type'] == 'GPT' or col['type'] == 'GPTCode':
                data[col['name']] = others[col['name']][i]
            else:
              if 'empty_index' in col and list(col['empty_index']).count(i)>0:
                data[col['name']] = None
              else:
                data[col['name']] = round(np.random.uniform(0,max(100,num_len)),2)
          
          output.append(data)
          # print(data)
        res.extend(output)
      else:
        print('无解')
        res.extend([])
    # sort part 
    print(sort_config)
    print(res)
    if len(sort_config)>0:
      col_name = sort_config[0]
      is_reverse = sort_config[1] == 'des'
      res.sort(key=lambda x:x[col_name],reverse=is_reverse)
    print(res)
    response_item['table']=res
    response_data.append(response_item)
    AllRes.append(res)
  return response_data
# =================================================


# =======================backend==============================
from flask import Flask, jsonify, request
import json

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

app = Flask(__name__)

@app.route('/submit', methods=['GET', 'POST'])
def submit_json_data():
  
  data = json.loads(request.data)
  print('input',data['data'])
  global output_option_list 
  output_option_list = {}
  out = dataGen(data['data'])
  print(output_option_list)

  return json.dumps({'data':out, 'optionList': output_option_list}, cls=NpEncoder)

if __name__ == '__main__':
  app.run()