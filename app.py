# 解析器函数定义
from faker import Faker
from itertools import product
import z3
import pandas as pd
import json
import csv
import numpy as np

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
  if cons == 'Int':
    col['type'] = 'Int'
  if cons == 'Real':
    col['type'] = 'Real'
  if cons == 'String':
    col['type'] = 'String'
  if cons == 'Date':
    col['type'] = 'Date'
  
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
    col['range'] = [eval(args[0]),eval(args[1])]
   
    if isinstance(col['range'][0],float) or isinstance(col['range'][1],float):
      if 'type' not in col: 
        col['type'] = 'Real'
    elif isinstance(col['range'][0],int) or isinstance(col['range'][1],int):
      if 'type' not in col: 
        col['type'] = 'Int'

  if cons.find('Repeat')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    if 'repeat' in col:
      col['repeat'] = col['repeat'] + [eval(x) for x in args]
    else:
      col['repeat'] = [eval(x) for x in args]
    
    for i in range(int(len(col['repeat'])/2)):
      content = col['repeat'][2*i]
      if isinstance(content,float) and 'type' not in col:
        col['type'] = 'Real'
        break
      elif isinstance(content,int) and 'type' not in col:
        col['type'] = 'Int'
      elif isinstance(content,str) and 'type' not in col:
        col['type'] = 'String'
        break

  if cons.find('Frequency')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    if 'frequency' in col:
      col['frequency'] = col['frequency'] + [eval(x) for x in args]
    else:
      col['frequency'] = [eval(x) for x in args]
    for i in range(int(len(col['frequency'])/2)):
      content = col['frequency'][2*i]
      if isinstance(content,float):
        col['type'] = 'Real'
        break
      elif isinstance(content,int) and 'type' not in col:
        col['type'] = 'Int'
      elif isinstance(content,str) and 'type' not in col:
        col['type'] = 'String'
        break

  if cons.find('Empty')!= -1:
    args = cons[cons.find('(')+1:cons.find(')')].split(',')
    col['empty'] = eval(args[0]) 


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

  unselected_index = np.arange(num_len)
  if 'repeat' in config and not 'distribution' in config:
    times = col['repeat']
    repeat_index = np.random.choice(unselected_index, times, replace=False)
    for index in repeat_index:
      data[index] = data[repeat_index[0]]
    unselected_index = [elem for elem in unselected_index if elem not in repeat_index]
    
  if 'empty' in config and not 'distribution' in config:
    times = col['empty']
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



# ===========================================================

# 带有$
# origin = [{
#   "( ($Length(10) $Opt $Length(20)) $And ($ColNum(6) $Opt $ColNum(10)) )": {
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
input_path = './input.json'

with open(input_path,"r") as f:
  origin = json.load(f)

print(origin)
# 拆分表格
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

# 单表映射
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
        if cons.find('ColNum') != -1:
          arg = cons[cons.find('(')+1:cons.find(')')]
          format['colNum'] = int(arg)
        if cons.find('Distribution'):
          arg = cons[cons.find('(')+1:cons.find(')')]
          dis_type = cons[cons.find('$')+1:cons.find('Distribution')]
          for child in format['children']:
            if child['name'] == arg:
              child['distribution'] = dis_type
      # 补充其余列
      if(len(value.items())<format['colNum']):
        for i in range(format['colNum']-len(value.items())):
          col = {}
          col['name'] = 'col'+str(len(value.items())+i+1)
          format['children'].append(col)
      tableParse.append(format)
  tables.append(tableParse)

tables


AllRes = []
for index in range(len(tables)):
  print('========  soving table '+str(index)+'  ========')
  print(table)
  table = tables[index]
  res = []
  for format in table:
    num_len = format['length']
    columns = format['children']
    col_size = format['colNum']
    
    d = {}
    others = {}

    solver = z3.Solver()

    for col in columns:
      special_value = 0
      special_index = []
      random_list = []
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
      #define range
      if 'range' in col:
        col_range = col['range']
        if col_type == 'Int' or col_type == 'Real':
          range_c = [z3.And(d[col['name']][i]>=col_range[0], d[col['name']][i]<=col_range[1]) for i in range(num_len)]
          solver.add(range_c)
          # seed = round(np.random.uniform(col_range[0],col_range[1]),1)
          # print(seed)
          # avg_c = z3.Sum([d[col['name']][i]for i in range(num_len)]) == num_len * seed
          # if not('distribution' in col):
          #   solver.add(avg_c)
        if col_type == 'Int':
          random_list = [round(np.random.uniform(col_range[0],col_range[1]),0) for i in range(num_len)]
        elif col_type == 'Real':
          random_list = [round(np.random.uniform(col_range[0],col_range[1]),2) for i in range(num_len)]
      else:
        # if col_type == 'Int' or col_type == 'Real':
        #   # range_c = [d[col['name']][i]>=0 for i in range(num_len)]          
        #   # solver.add(range_c)
        #   seed = round(np.random.uniform(0,100),1)
        #   avg_c = z3.Sum([d[col['name']][i]for i in range(num_len)]) == num_len * seed
        #   solver.add(avg_c)
        if col_type == 'Int':
          random_list = [round(np.random.uniform(0,100),0) for i in range(num_len)]
        elif col_type == 'Real':
          random_list = [round(np.random.uniform(0,100),2) for i in range(num_len)]
        elif col_type == 'String':
          random_list = [fake.pystr() for i in range(num_len)]
          
      #define repeat
      if 'repeat' in col:
        for i in range(int(len(col['repeat'])/2)):
          content = col['repeat'][2*i]
          times = col['repeat'][2*i+1]
          special_value += times
          
          repeat_c = z3.Sum([d[col['name']][i]==content for i in range(num_len)]) == times
          solver.add(repeat_c)

      #define frequency
      if 'frequency' in col:
        for i in range(int(len(col['frequency'])/2)):
          content = col['frequency'][2*i]
          times = col['frequency'][2*i+1]
          special_value += num_len * times
          frequency_c = z3.Sum([d[col['name']][i]==content for i in range(num_len)]) == num_len * times
          solver.add(frequency_c)
      
      #define frequency
      if 'freqIf' in col:
        for i in range(int(len(col['freqIf'])/2)):
          content = col['freqIf'][2*i]
          times = col['freqIf'][2*i+1]
          special_value += num_len * times
          freqIf_c = z3.Sum([exec(d[col['name']][i]+content,d[col['name']]) for i in range(num_len)]) == num_len * times
          solver.add(freqIf_c)

      if 'empty' in col:
        times = col['empty']
        special_value += times
        if col['type'] == 'Int':
          empty_c = z3.Sum([d[col['name']][i] == 999999 for i in range(num_len)]) == times
        elif col['type'] == 'Real':
          empty_c = z3.Sum([d[col['name']][i] == 1.12345 for i in range(num_len)]) == times
        elif col['type'] == 'String':
          empty_c = z3.Sum([d[col['name']][i] == '' for i in range(num_len)]) == times
        solver.add(empty_c)

      #define enum
      if 'enum' in col:
        col_enum = col['enum']
        enum_c = [z3.Or([d[col['name']][i] == col_enum[j] for j in range(len(col_enum))])
                for i in range(num_len)]
        solver.add(enum_c)
      
      #define distinct
      if 'distinct' in col:
        col_distinct = col['distinct']
        if col_distinct == 'true':
          distinct_c = z3.Distinct([d[col['name']][i] for i in range(num_len)])
          solver.add(distinct_c)

      #define distribution
      if 'distribution' in col:
        col_distri = col['distribution']
        if col_distri == 'Stable':
          # 方差
          var_c = [z3.And(z3.Sum([(d[col['name']][i]-z3.Sum(d[col['name']])/num_len)**2 for i in range(num_len)])/num_len < 2,
                      z3.Sum([(d[col['name']][i]-z3.Sum(d[col['name']])/num_len)**2 for i in range(num_len)])/num_len > 0)  
                  for i in range(num_len)]
          solver.add(var_c)
        if col_distri == 'BlowUp':
          # 递增
          a = z3.Real('a')
          asc_c = [z3.And(d[col['name']][i]<d[col['name']][i+1], a > 1, a < 1.01)  for i in range(num_len-1)]
          # asc_c = [d[col['name']][i]<d[col['name']][i+1] for i in range(num_len-1)]
          solver.add(asc_c)
        if col_distri == 'period':
          fre = 3
          fre_len = num_len//fre
          #分布
          distri_c = [d[col['name']][i]<d[col['name']][i+1] if i< fre_len//2 else d[col['name']][i]>d[col['name']][i+1] for i in range(fre_len)]
          # 周期
          period_c = [z3.And(d[col['name']][fre_len*j+i]<=d[col['name']][i+1],d[col['name']][fre_len*j+i]>=d[col['name']][i]) if i< fre_len//2 
                      else z3.And(d[col['name']][fre_len*j+i]>=d[col['name']][i+1],d[col['name']][fre_len*j+i]<=d[col['name']][i])
                      for i in range(fre_len) for j in range(1,fre)]
          solver.add(distri_c+period_c)

      # 随机数
      if 'type' in col and (col['type']=='Int' or col['type']=='Real' or col['type']=='String') and not 'distribution' in col:
        # print(random_num,random_list)
        random_num = num_len - special_value
        random_c = z3.Sum([d[col['name']][i]==random_list[i] for i in range(num_len)]) == random_num
        solver.add(random_c)
        
    output = []
    if solver.check()==z3.sat:
      m = solver.model()
      for i in range(num_len):
        data = {}
        
        for col in columns:
          if 'type' in col:
            if col['type'] == 'Int':
              data[col['name']] = None if m[d[col['name']][i]].as_long() == 999999 else m[d[col['name']][i]].as_long()
            elif col['type'] == 'Real':
              if float(m[d[col['name']][i]].numerator_as_long())/float(m[d[col['name']][i]].denominator_as_long()) == 1.12345:
                data[col['name']] = None
              else:
                data[col['name']] = float(m[d[col['name']][i]].numerator_as_long())/float(m[d[col['name']][i]].denominator_as_long())  
            elif col['type'] == 'String':
              data[col['name']] = None if m[d[col['name']][i]]=='' else eval(str(m[d[col['name']][i]]))
            elif col['type'] == 'Date':
              if i < len(others[col['name']]):
                data[col['name']] = others[col['name']][i]
              else:
                data[col['name']] = ''
            elif col['type'] == 'Faker':
              data[col['name']] = others[col['name']][i]
          else:
            data[col['name']] = round(np.random.uniform(0,10000),2)
        output.append(data)
      print('========  write to csv:  ','"./data/test'+str(index)+'.csv"  ========')
      parse2csv(output,'./data/test'+str(index)+'.csv')
    else:
      print('无解')
    res.extend(output)
  AllRes.append(res)

AllRes