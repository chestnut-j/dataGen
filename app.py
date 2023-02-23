# 解析器函数定义
from faker import Faker
from itertools import product
import z3
import pandas as pd
import json
import csv
import numpy as np
import math

fake = Faker()

def findPosi(allStr, findStr):
  #用于存储findStr标识符的出现
  posiList = []
  #是否有findStr的标识符
  findPosi = False
  findOption = False
  #先确定是否存在findStr标识符并获取其位置
  if allStr.find(findStr) != -1:
      posiList.append(allStr.find(findStr))
      #已找到当前的posiStr位置，可以继续寻找下一个
      findOption = True
      #下一个标识符开始寻找的位置
      findPosi = allStr.find(findStr) + 1
  #寻找约束中剩余的findStr标识符
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

def orSoluntion(optionList):
  optionResult = []
  for option in optionList:
      optionResult.append(option[np.random.randint(0,len(option))])
  return optionResult

# 计算slot内的括号数
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
    # print(constraintStr)
    #用于存储前括号的位置信息
    frontParenthesisList = findPosi(constraintStr, '(')
    #用于存储后括号的位置信息
    backParenthesisList = findPosi(constraintStr, ')')
    if len(frontParenthesisList) > len(backParenthesisList):
        slotParenthesis = calculateSlotParenthesis(frontParenthesisList, backParenthesisList, True)
        slotStart = frontParenthesisList[-(slotParenthesis+1)]
        tempSlotContent.append(constraintStr[slotStart + 1:])
        slotJson += constraintStr[:slotStart]
        slotJson += "{"
    # 处理字符串中只有条件的情况
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

  #用于存储前括号的位置信息
  frontSlotList = findPosi(slotJson, '{')
  #用于存储后括号的位置信息
  backSlotList = findPosi(slotJson, '}')
  if len(tempSlotContent):
    slotContentList.append(tempSlotContent)
  if len(frontSlotList)>len(backSlotList):
    slotJson += "}"
  # print(slotJson, slotContentList)
  return [slotJson, slotContentList]    

def removeOrOp(constraint):
  # 根据op标识符的位置把constraint分割为多个部分
  constraintList = findConstrain(constraint, "Or")
  # 根据括号寻找slot的位置
  [slotJson, slotContentList] = generateSlot(constraintList)
  optionResult = orSoluntion(slotContentList)
  
  finalJson = ''
  finalJson = slotJson.format(*optionResult)
  
  return finalJson

def isOuterrontParenthesis(constraint):
  if constraint[0] == '(' and constraint[len(constraint)-1] == ')':
    constraint = constraint[1:len(constraint)-1]
    #用于存储前括号的位置信息
    frontParenthesisList = findPosi(constraint, '(')
    #用于存储后括号的位置信息
    backParenthesisList = findPosi(constraint, ')')
    for position in range(0, len(backParenthesisList)):
      if frontParenthesisList[position] > backParenthesisList[position]:
        return False
    return True
  else:
    return False

def parseConstraint(rawConstraint):

    constraint = rawConstraint.replace(" ","")

    if constraint.find('Opt') == -1:
      if isOuterrontParenthesis(constraint):
        constraint = constraint[1:len(constraint)-1]
      return [constraint]
            
    # # 根据option标识符的位置把constraint分割为多个部分
    constraintList = findConstrain(rawConstraint, "Opt")
 
    [slotJson, slotContentList] = generateSlot(constraintList)
    optionResult = optionSoluntion(slotContentList)
    
    finalJsonList = []
    for ri in optionResult:
        finalJsonList.append(slotJson.format(*ri))
        
    return finalJsonList

def findConstrain(allStr, operation):
    constraint = allStr.replace(" ","")
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

def parseCons(cons, col):
  # parse type
  if ['Int','Real','String','Date'].count(cons)>0:
    col['type'] = cons
  
  if cons.find('DateData')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['range'] = [eval(args[0]),eval(args[1])]
    col['format'] = eval(args[2])
    if eval(args[2]) == 'YYYY-MM-DD':
      col['freq'] = 'D'
    if eval(args[2]) == 'YYYY-MM':
      col['freq'] = 'M'
    if eval(args[2]) == 'YYYY':
      col['freq'] = 'Y'
  
  if cons.find('Faker')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['type'] = 'Faker'
    col['content'] = args[0]
    if len(args)==2:
      col['locale'] = args[1]

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
    cons_name = cons[:cons.find('(')].lower()
    col[cons_name] = eval(args[0])
    if isinstance(col[cons_name] ,float) and 'type' not in col:
      col['type'] = 'Real'
    elif isinstance(col[cons_name],int) and 'type' not in col:
      col['type'] = 'Int'
  

  if cons.find('Repeat')!= -1 or cons.find('Frequency')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    cons_name = cons[:cons.find('(')].lower()
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

  if cons.find('FreqIf')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    if 'freqIf' in col:
      col['freqIf'] = col['freqIf'] + [eval(x) for x in args]
    else:
      col['freqIf'] = [eval(x) for x in args]

  if cons.find('Empty')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['empty'] = eval(args[0]) 

  if cons.find('Cluster')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['cluster'] = eval(args[0]) 

  if cons.find('Trend')!= -1:
    if 'trend' in col:
      raise Exception('Repeat setting the constraints on the trend')
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['trend'] =  [eval(x) for x in args]

  if cons.find('Distribution')!= -1:
    if 'distribution' in col:
      raise Exception('Repeat setting the constraints on the distribution')
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['distribution'] =  [eval(x) for x in args]

  if cons.find('Correlation')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['correlation'] = [eval(x) for x in args]

def date_format_match(format):
  if format == 'YYYY-MM-DD':
    return '%Y-%m-%d'
  if format == 'YYYY-MM':
    return '%Y-%m'
  if format == 'YYYY':
    return '%Y'

def solveDate(config):
  data = pd.date_range(config['range'][0], config['range'][1], freq=config['freq']).strftime(date_format_match(config['format']))
  return data

def solveFaker(config, len):
  if 'locale' in config:
    fk = Faker(locale=config['locale'])
  else:
    # fk = Faker(locale='zh-CN')
    fk = Faker()
  data = [eval('faker.'+config['content']+'()',{'faker': fk}) for i in range(len)]

  unselected_index = np.arange(len)
  if 'repeat' in config and not 'trend' in config:
    times = config['repeat']
    repeat_index = np.random.choice(unselected_index, times, replace=False)
    for index in repeat_index:
      data[index] = data[repeat_index[0]]
    unselected_index = [elem for elem in unselected_index if elem not in repeat_index]
    
  if 'empty' in config and not 'trend' in config:
    times = config['empty']
    empty_index = np.random.choice(unselected_index, times, replace=False)
    for index in empty_index:
      data[index] = None
  
  return data

def parse2csv(data_list,path):
  csv_fp = open(path,'w',encoding='utf-8',newline='')
  # print(data_list)
  sheet_title = data_list[0].keys()
  sheet_data = []
  for data in data_list:
    sheet_data.append(data.values())
  writer = csv.writer(csv_fp)
  writer.writerow(sheet_title)
  writer.writerows(sheet_data)
  csv_fp.close()

# 拆分表格
def parseJson(origin):
  allTables = []

  for format in origin:
    
    test = []
    remainValue = {}
    value_test = []
    key_test = []
    for key, value in format.items():
      test = parseConstraint(key)
      remainValue = value
      # print(value.items())
      for col_key, col_value in value.items():
        value_test.append(parseConstraint(col_value))
        key_test.append(col_key)
    valueList = []
    valueList = product(*value_test)

    for value_op in valueList:
      for op in test:
        parseFormat = []
        item = {}
        valueFormat = {}
        for i in range(len(key_test)):
          if value_op[i].find('Or') != -1:
            valueFormat[key_test[i]] = removeOrOp(value_op[i])
          else:
            valueFormat[key_test[i]] = value_op[i] 
        item[op] = valueFormat
        parseFormat.append(item)
        allTables.append(parseFormat)
  return allTables

# 单表映射
def parseTable(allTables):
  tables = []
  for table in allTables:
    tableParse = []
    for element in table:
      for key,value in element.items():
        format = {
          'children': []
        }
        # parse children
        for col_key, col_value in value.items():
          col = {}
          col['name'] = col_key
          
          consList = findConstrain(col_value, 'And')
          if len(consList) == 0:
            consList.append(col_value)
          for cons in consList:
              parseCons(cons, col)
          if 'type' not in col:
            col['type'] = 'Real'
          format['children'].append(col)
        # parse key
        constrainList = findConstrain(key, 'And')
        for cons in constrainList:
          if cons.find('Length') != -1:
            arg = cons[cons.find('(')+1:cons.find(')')]
            format['length'] = int(arg)
          if cons.find('Column') != -1:
            arg = cons[cons.find('(')+1:cons.find(')')]
            format['column'] = int(arg)
          if cons.find('Trend'):
            arg = cons[cons.find('(')+1:cons.find(')')]
            dis_type = cons[cons.find('$')+1:cons.find('Trend')]
            for child in format['children']:
              if child['name'] == arg:
                child['trend'] = dis_type
        # 补充其余列
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
      if col_type == 'Date':
        others[col['name']] = solveDate(col)
        continue
      if col_type == 'Faker':
        # random_list = solveFaker(col,num_len)
        others[col['name']] = solveFaker(col,num_len)
        continue
    else:
      d[col['name']] = [z3.Int(f"{col['name']}_{i}") for i in range(num_len)]
    
    unselected_index = np.arange(num_len)
    
    if 'empty' in col:
      times = col['empty']
      special_value += times
      empty_index = np.random.choice(unselected_index, times, replace=False)
      col['empty_index'] = empty_index
      unselected_index = [elem for elem in unselected_index if elem not in empty_index]
      nonempty_index = [elem for elem in range(num_len) if elem not in empty_index]

    if 'max' in col:
      value = col['max']
      if 'range' in col:
        col['range'][1] = value
      else:
        col['range'] = [0,value]
      max_index = np.random.choice(unselected_index, 1, replace=False)[0]
      special_value += 1
      unselected_index = [elem for elem in unselected_index if elem != max_index]
      max_c = z3.And(z3.And([d[col['name']][i]<=d[col['name']][max_index] for i in unselected_index]),d[col['name']][max_index]==value)
      solver.add(max_c)

    if 'min' in col:
      value = col['min']
      if 'range' in col:
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
      var_c = z3.Sum([(d[col['name']][i]-avg)**2 for i in nonempty_index])/len(nonempty_index) == value
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
                    z3.Sum([d[col['name']][i]<value for i in unselected_index])==quan_len,
                    d[col['name']][special_index]==value
                  )
      else:
        special_index = np.random.choice(unselected_index, 2, replace=False)
        special_value += 2
        unselected_index = [elem for elem in unselected_index if elem not in special_index]
        quan_c = z3.And(
                    z3.Sum([d[col['name']][i]<value for i in unselected_index])==quan_len-1,
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
    if 'frequency' in col:
      for i in range(int(len(col['frequency'])/2)):
        content = col['frequency'][2*i]
        times = col['frequency'][2*i+1]
        special_value += round(num_len * times)
        frequency_c = z3.Sum([d[col['name']][i]==content for i in unselected_index]) == round(num_len * times)
        solver.add(frequency_c)
    
    #define frequency
    if 'freqIf' in col:
      for i in range(int(len(col['freqIf'])/2)):
        content = col['freqIf'][2*i]
        times = col['freqIf'][2*i+1]
        special_value += round(num_len * times)
        freqIf_c = z3.Sum([eval('m'+content,{'m': d[col['name']][i]}) for i in unselected_index]) == round(num_len * times)
        solver.add(freqIf_c)
    
    # if 'repeat' in col or 'frequency' in col:
    #   distinct_c = z3.Distinct([d[col['name']][i] for i in unselected_index])
    #   solver.add(distinct_c)

    #define cluster
    if 'cluster' in col:
      part = col['cluster']
      part_num = num_len // part
      if 'range' in col:
        range_len = col['range'][1]-col['range'][0]
        # part_space = range_len//(part*2)
        # part_range = range_len//part
        part_mid = range_len//(part-1)
        part_len = range_len//(2*part)

        cluster_c = [
          z3.Sum([z3.And(d[col['name']][i]>col['range'][0]+part_mid*p-part_len,d[col['name']][i]<col['range'][0]+part_mid*p+part_len) for i in nonempty_index]) == part_num
          for p in range(part)
        ]
      else:
        part_mid = max(100,num_len)//(part-1)
        part_len = max(100,num_len)//(2*part)
        cluster_c = [
          z3.Sum([z3.And(d[col['name']][i]>part_mid*p-part_len,d[col['name']][i]<part_mid*p+part_len) for i in nonempty_index]) == part_num
          for p in range(part)
        ]
      solver.add(cluster_c)

    #define correlation
    if 'correlation' in col:
      [col_name, type, k] = col['correlation']
      if type == 'linear':
        correlation_c = [d[col['name']][i]==k*d[col_name][i] for i in nonempty_index]
      solver.add(correlation_c)

    #define enum
    if 'enum' in col:
      col_enum = col['enum']
      enum_c = [z3.Or([d[col['name']][i] == col_enum[j] for j in range(len(col_enum))])
              for i in unselected_index]
      solver.add(enum_c)
    
    #define distinct
    if 'distinct' in col:
      col_distinct = col['distinct']
      if col_distinct == 'true':
        distinct_c = z3.Distinct([d[col['name']][i] for i in unselected_index])
        solver.add(distinct_c)

    #define trend
    if 'trend' in col:
      col_trend = col['trend'][0]
      if col_trend == 'Stable':
        # 方差
        var_c = [z3.And(z3.Sum([(d[col['name']][i]-z3.Sum(d[col['name']])/num_len)**2 for i in range(num_len)])/num_len < 2,
                    z3.Sum([(d[col['name']][i]-z3.Sum(d[col['name']])/num_len)**2 for i in range(num_len)])/num_len > 0)  
                for i in range(num_len)]
        solver.add(var_c)
      if col_trend == 'linear':
        # 线性
        scope = col['trend'][1]
        a = np.random.random()+1
        linear_c = [d[col['name']][i]==scope*i+a for i in nonempty_index]
        # dec_c = [z3.And(d[col['name']][i]>=a*d[col['name']][j], a > 1) if i<=j else True  for j in nonempty_index for i in nonempty_index]
        # asc_c = [d[col['name']][i]<d[col['name']][i+1] for i in range(num_len-1)]
        solver.add(linear_c)
      if col_trend == 'quadratic':
        # 平方
        a = np.random.random()+1
        quad_c = [d[col['name']][i]==i*i+a for i in nonempty_index]
        solver.add(quad_c)
      if col_trend == 'exponential':
        # 指数
        base = col['trend'][1]
        a = np.random.random()+1
        exp_c = [d[col['name']][i]==math.pow(base,i)+a for i in nonempty_index]
        solver.add(exp_c)
      if col_trend == 'periodic':
        fre = 3
        fre_len = num_len//fre
        #分布
        distri_c = [d[col['name']][i]<d[col['name']][i+1] if i< fre_len//2 else d[col['name']][i]>d[col['name']][i+1] for i in range(fre_len)]
        # 周期
        period_c = [z3.And(d[col['name']][fre_len*j+i]<=d[col['name']][i+1],d[col['name']][fre_len*j+i]>=d[col['name']][i]) if i< fre_len//2 
                    else z3.And(d[col['name']][fre_len*j+i]>=d[col['name']][i+1],d[col['name']][fre_len*j+i]<=d[col['name']][i])
                    for i in range(fre_len) for j in range(1,fre)]
        solver.add(distri_c+period_c)

    #define range
    random_num = num_len - special_value
    temp_len = int(1.3*num_len)
    if 'range' in col:
      col_range = col['range']
      if col_type == 'Int' or col_type == 'Real':
        range_c = [z3.And(d[col['name']][i]>=col_range[0], d[col['name']][i]<=col_range[1])  for i in nonempty_index]
        solver.add(range_c) 
      if col_type == 'Int':
        if 'distribution' in col:
          args = col['distribution']
          if args[0]=='normal':
            random_list = np.random.normal(args[1],args[2],temp_len)
          elif args[0]=='uniform':
            random_list = np.random.uniform(args[1],args[2],temp_len)
        else:
          random_list = np.random.uniform(col_range[0],col_range[1],temp_len)
      elif col_type == 'Real':
        random_list = np.random.uniform(col_range[0],col_range[1], temp_len)
    else:
      if col_type == 'Int' or col_type == 'Real':
        if 'distribution' in col:
          args = col['distribution']
          if args[0]=='normal':
            random_list = np.random.normal(args[1],args[2],temp_len)
          elif args[0]=='uniform':
            random_list = np.random.uniform(args[1],args[2],temp_len)
        else:
          random_list = np.random.uniform(0,max(100,num_len), temp_len)
      elif col_type == 'String':
        random_list = [fake.pystr() for i in range(3*num_len)]

    if 'cluster' in col:
      part = col['cluster']
      part_num = num_len // part
      random_list = []
      if 'range' in col:
        range_len = col['range'][1]-col['range'][0]
        part_mid = range_len//(part-1)
        part_len = range_len//(2.5*part)
        for p in range(part):
          random_list.extend(np.random.uniform(max(col['range'][0]+part_mid*p-part_len,col['range'][0]),min(col['range'][0]+part_mid*p+part_len,col['range'][1]), part_num))
      else:
        part_mid = max(100,num_len)//(part-1)
        part_len = max(100,num_len)//(2*part)
        for p in range(part):
          random_list.extend(np.random.uniform(part_mid*p-part_len,part_mid*p+part_len,part_num))
   
    # # 随机数
    if 'type' in col and (col['type']=='Int' or col['type']=='Real' or col['type']=='String') and not 'trend' in col and not 'correlation' in col:
      # print(random_num,random_list)
      # random_c = z3.Sum([d[col['name']][i] == random_list[i] for i in unselected_index]) == random_num
      if col['type']=='Int':
        # sample_pool = np.random.choice(random_list,num_len, replace=False)
        # random_c = [[d[col['name']][i] == int(sample_pool[i])] for i in unselected_index]
        random_c = z3.Sum([z3.Or([d[col['name']][i] == int(temp) for temp in np.random.choice(random_list,5, replace=False)]) for i in unselected_index]) == random_num
      if col['type']=='Real':
        random_c = z3.Sum([z3.Or([d[col['name']][i] == round(temp,2) for temp in np.random.choice(random_list,5, replace=False)]) for i in unselected_index]) == random_num
      else:
        random_c = z3.Sum([z3.Or([d[col['name']][i] == temp for temp in np.random.choice(random_list,3, replace=False)]) for i in unselected_index]) == random_num
      solver.add(random_c)
  return [solver, d, others]

def save2json(data, path):
  b = json.dumps(data)
  json_fp = open(path,'w')
  json_fp.write(b)
  json_fp.close

# ===========================================================

# 带有$
# origin = [{
#   "( ($Length(10) $Opt $Length(20)) $And ($column(6) $Opt $column(10)) )": {
#       "index": "$Int $And ( $Range(0,20) $Opt $Range(10,50))",
#       "col1": "$Int $And ($Repeat(5,5) $Opt $Repeat(2,2)) $And $Empty(1)",
#       "col2": "$String $And ($Empty(5) $Or $Repeat('a',2)) $And ($Empty(6) $Or $Repeat('b',2))",
#       "col3": "$Int $And $Frequency(6, 0.4, 5, 0.3) $And $Empty(2)",
#       "col4": "$Real $And $FreqIf(>6, 0.4)",
#       "col5": "$Real $And $Range(0, 400)",
#       "col5": "$Faker(name) $And ($Empty(1) $Or $Repeat(3))",
#       "col6": "$Faker(phone_number)",
#   }
# }]
# input_path = './input.json'
# input_path = './test1.json'

input_path = './sample.json'
# input_path = './example.json'

with open(input_path,"r") as f:
  origin = json.load(f)

print(origin)

allTables = parseJson(origin)

tables = parseTable(allTables)

AllRes = []
for index in range(len(tables)):
  table = tables[index]

  print('========  soving table '+str(index)+'  ========')
  print(table)
  res = []
  for format in table:
    try:
      [solver, d, others] = buildSolver(format)
    except Exception as e:
      print(e)

    num_len = format['length']
    columns = format['children']
    col_size = format['column']
    
    output = []
    cnt = 0
    while solver.check()!=z3.sat and cnt<50:
      print('try :', cnt)
      [solver, d, others] = buildSolver(format)
      cnt+=1

    if solver.check()==z3.sat:
      m = solver.model()

      #json list mode [{a:1,b:2},{a:2},{b:2}...]
      for i in range(num_len):
        data = {}
        
        for col in columns:
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
              data[col['name']] = None if 'empty_index' in col and list(col['empty_index']).count(i)>0 else eval(str(m[d[col['name']][i]]))
            elif col['type'] == 'Date':
              if i < len(others[col['name']]):
                data[col['name']] = others[col['name']][i]
              else:
                data[col['name']] = ''
            elif col['type'] == 'Faker':
              data[col['name']] = others[col['name']][i]
          else:
            data[col['name']] = round(np.random.uniform(0,max(100,num_len)),2)
        output.append(data)
        # print(data)
      print('========  write to csv:  ','"./data/test'+str(index)+'.csv"  ========')
      res.extend(output)
      parse2csv(output,'./data/test'+str(index)+'.csv')
      save2json(output,'./data/json'+str(index)+'.json')
      #item list mode {a:[1,2],b:[2,2]...}
      mode2 = {}
      for col in columns:
        if 'type' in col:
          if col['type'] == 'Int':
            mode2[col['name']] = [None if 'empty_index' in col and list(col['empty_index']).count(i)>0 else m[d[col['name']][i]].as_long() for i in range(num_len)]
            # data[col['name']] = None if m[d[col['name']][i]].as_long() == 999999 else m[d[col['name']][i]].as_long()
          elif col['type'] == 'Real':
            mode2[col['name']] = [None if 'empty_index' in col and list(col['empty_index']).count(i)>0 
                                  else float(m[d[col['name']][i]].numerator_as_long())/float(m[d[col['name']][i]].denominator_as_long())
                                  for i in range(num_len)]
          elif col['type'] == 'String':
            mode2[col['name']] = [None if 'empty_index' in col and list(col['empty_index']).count(i)>0 else eval(str(m[d[col['name']][i]])) for i in range(num_len)]
          elif col['type'] == 'Date':
            mode2[col['name']] = [others[col['name']][i] if i < len(others[col['name']]) else ''
                                  for i in range(num_len)]
          elif col['type'] == 'Faker':
            mode2[col['name']] = [others[col['name']][i] for i in range(num_len)]
        else:
          mode2[col['name']] = [round(np.random.uniform(0,max(100,num_len)),2) for i in range(num_len)]
      save2json(mode2,'./data/test'+str(index)+'.json')
    else:
      print('无解')
  
  AllRes.append(res)

AllRes