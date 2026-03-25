---
title: 'Few-shot与推理激发'
---

## 核心问题

复杂任务怎样减少跳步、漏步和理由不足。

## 这节学什么

学习 few-shot、step-back 等方法何时有效，何时会徒增噪音。

## 为什么这节重要

基础提示词解决的是“把任务写清楚”，但一旦任务开始变复杂，单靠清晰描述仍然不够。模型常见的问题是：

- 直接跳到结论
- 中间推理不完整
- 看起来像在分析，其实只是复述
- 格式对了，但判断过程很浅

这节课要解决的，就是如何给模型“示例”和“思考路径”，让它从机械回答转向更稳的推理。

## 关键概念

- few-shot
- step-back
- self-consistency
- reasoning trace

## 通俗解释

### 1. 什么是 zero-shot

zero-shot 就是不提供例子，直接提问。

例如：

```text
请把下面评论分成正面、负面和中立。
```

优点是快，缺点是模型只能靠自己猜测你想要的风格和标准。

### 2. 什么是 few-shot

few-shot 就是在真正任务前，先给模型几个高质量示例。

例如：

```text
评论：这个功能非常实用。 -> 正面
评论：页面很乱，我找不到按钮。 -> 负面
评论：功能不少，但还需要适应。 -> 中立

现在请分类：
评论：客服回复很慢，但最后问题解决了。
```

few-shot 的本质不是“多给几条数据”，而是给模型看“我认可的输出模式”。

### 3. 为什么示例能改变输出质量

因为模型非常擅长模式匹配。示例会同时传递：

- 输出格式
- 判断标准
- 语言风格
- 什么算好答案

所以很多时候，给 2 到 4 个高质量示例，比写一大段抽象说明更有效。

### 4. 什么是推理激发

推理激发就是通过提示设计，让模型不要直接给答案，而是显式或隐式地展开思考过程。

常见方法包括：

- step-back
- Chain of Thought
- Tree of Thoughts
- Graph-style reasoning

## 从 zero-shot 到 graph 的关系

可以把它们看成一条逐渐增强的链条：

### Zero-shot

直接回答。适合简单任务。

### Few-shot

先示范，再回答。适合格式化、风格对齐、分类、抽取。

### Step-back

先退一步想原则，再回到当前问题。适合抽象理解、课程设计、复杂解释。

### Chain of Thought

按一条线一步一步推理。适合数学、逻辑、方案论证。

### Tree of Thoughts

不是只走一条路，而是探索多条可能路径，再比较、剪枝。适合复杂决策、规划和创意问题。

### Graph-style reasoning

不仅多路径，而且允许不同路径之间相互连接、汇合、重组。适合复杂系统分析、跨维度整合、科研方案综合论证。

## 核心方法展开

### 1. Step-back Prompting

step-back 的意思是“先退一步看问题”。

例如不是直接问：

```text
怎么设计一门时间管理课程？
```

而是先问：

```text
成年学习者在学习时间管理时最常见的认知障碍是什么？
```

再回到原任务。

它适合：

- 课程设计
- 概念解释
- 复杂写作
- 研究问题构思

### 2. Chain of Thought

CoT 的核心是让模型显式写出中间步骤。

典型形式是：

```text
请一步一步思考。
```

它适合：

- 数学推理
- 条件逻辑
- 多步分析
- 合同差异比较

局限：

- 只是一条线
- 一旦前面错，后面会一路错下去

### 3. Tree of Thoughts

ToT 的核心是“不要只走一条推理路线”，而是并行考虑多个可能分支。

它适合：

- 战略规划
- 复杂决策
- 创意任务
- 多方案比较

局限：

- 成本高
- 对提示设计要求更高
- 往往需要外部程序配合

### 4. Graph-style reasoning

图式推理可以理解为“多条路径之间还可以交叉借力”。

它适合：

- 跨文献综合
- 系统设计
- 复杂项目规划
- 多变量决策分析

局限：

- 更接近高级工作流编排
- 单纯靠日常聊天式提示很难完全实现

## 典型练习

比较直接提问、few-shot 和 step-back 对同一复杂任务的表现。

## 最小示例

给模型两个高质量示例后，再要求它完成第三个相似任务。

## 10个可直接上手的例子

### 例子1：分类任务的 few-shot

```text
评论：电池续航太差。 -> 负面
评论：屏幕非常清晰。 -> 正面
评论：功能不少，但还需要适应。 -> 中立

现在请判断：
评论：客服回复很慢，但最后问题解决了。
```

### 例子2：信息抽取的 few-shot

```text
文本：小份奶酪披萨
输出：{"size":"small","type":"cheese"}

文本：大份番茄罗勒披萨
输出：{"size":"large","type":"tomato_basil"}

现在处理：
文本：中份意大利辣香肠披萨
```

### 例子3：Zero-shot CoT 数学推理

```text
我哥哥2岁时，我是4岁。现在我40岁，我哥哥几岁？请一步一步思考。
```

### 例子4：课程设计的 step-back

```text
第一步：列出成年在职学习者学习时间管理时最常见的认知障碍。
第二步：基于这些障碍，设计一门两小时课程。
```

### 例子5：研究分析

```text
请先提取这三篇论文的核心问题，再比较它们的方法差异，最后提出两个下一步研究问题。
```

### 例子6：复杂决策的 tree 思路

```text
请分别从“预算有限”和“预算充足”两种前提出发，比较出海与深耕国内市场的优劣，然后选出最稳健方案。
```

### 例子7：长文比较

```text
请一步一步比较这两份合同在竞业限制期限、违约金、适用范围上的差异，并输出表格。
```

### 例子8：方案生成

```text
请一步一步设计一个新软件产品的营销方案：
1. 先分配预算
2. 再设定渠道KPI
3. 再写执行时间表
```

### 例子9：写作改进

```text
请先识别这段引言的逻辑漏洞，再提出修改方向，最后给出改写版本。
```

### 例子10：图式推理

```text
请从用户需求、成本结构、竞争环境、技术可行性四个维度分别分析这个产品方案，再整合这四条分析，给出综合建议。
```

## 本地测试代码：Ollama + gemma3:4b

先确保模型已经拉取：

```bash
ollama pull gemma3:4b
```

### 方式一：命令行直接测试 CoT

```bash
ollama run gemma3:4b "请一步一步思考：当我6岁时，我妹妹年龄是我的一半。我现在70岁，我妹妹多大？"
```

### 方式二：PowerShell 比较 zero-shot 和 few-shot

```powershell
$prompt = @"
任务：把评论分成正面、负面、中立。

示例1：
评论：电池续航太差。
标签：负面

示例2：
评论：屏幕非常清晰。
标签：正面

示例3：
评论：功能不少，但需要适应。
标签：中立

现在请判断：
评论：客服回复很慢，但最后问题解决了。
"@

$body = @{
    model = "gemma3:4b"
    prompt = $prompt
    stream = $false
    options = @{
        temperature = 0.2
        top_p = 0.9
    }
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/generate" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response.response
```

### 方式三：Python 比较 zero-shot、few-shot、step-back

```python
import requests

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"

prompts = {
    "zero_shot": "请设计一门两小时的时间管理课程。",
    "few_shot": """
任务：设计课程。
示例1：
主题：情绪管理
输出：课程目标、三大模块、互动活动、时间分配

示例2：
主题：沟通能力
输出：课程目标、三大模块、互动活动、时间分配

现在请设计：
主题：时间管理
""",
    "step_back": """
第一步：列出成年在职学习者学习时间管理时最常见的认知障碍。
第二步：基于这些障碍，设计一门两小时课程。
输出：课程目标、三大模块、互动活动、时间分配。
"""
}


def run_prompt(prompt_text):
    payload = {
        "model": MODEL,
        "prompt": prompt_text,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9
        }
    }
    response = requests.post(URL, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["response"].strip()


for name, prompt_text in prompts.items():
    print("=" * 80)
    print(name)
    print("=" * 80)
    print(run_prompt(prompt_text))
    print()
```

### 方式四：Python 测试 CoT、Tree、Graph 风格

```python
import requests

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"
TASK = "公司正在考虑是进入国际市场，还是继续深耕国内市场。"

prompts = {
    "chain": f"""
{TASK}
请一步一步推理，最后给出结论。
""",
    "tree": f"""
{TASK}
请探索至少三条不同推理路径：
1. 预算有限情境
2. 预算充足情境
3. 竞争压力上升情境
然后比较这三条路径，选出最稳健方案。
""",
    "graph": f"""
{TASK}
请分别从市场、成本、风险、组织能力四个维度独立分析，
再把四个维度的结论整合成一个综合判断，
并指出哪些维度之间存在相互强化或相互冲突的关系。
"""
}


def run_prompt(prompt_text):
    payload = {
        "model": MODEL,
        "prompt": prompt_text,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9
        }
    }
    response = requests.post(URL, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["response"].strip()


for name, prompt_text in prompts.items():
    print("=" * 80)
    print(name)
    print("=" * 80)
    print(run_prompt(prompt_text))
    print()
```

### 方式五：保存实验结果到 CSV

```python
import csv
import requests

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"

experiments = {
    "zero_shot": "请比较两种市场策略。",
    "cot": "请一步一步比较两种市场策略。",
    "tree": "请从三种情境探索两种市场策略，再比较结论。",
    "graph": "请从市场、成本、风险、组织能力四个维度分析两种市场策略，再整合判断。"
}


def run_prompt(prompt_text):
    payload = {
        "model": MODEL,
        "prompt": prompt_text,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9
        }
    }
    response = requests.post(URL, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["response"].strip()


rows = []
for name, prompt_text in experiments.items():
    rows.append({
        "model": MODEL,
        "method": name,
        "prompt": prompt_text,
        "response": run_prompt(prompt_text)
    })

with open("gemma3_4b_reasoning_experiments.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=["model", "method", "prompt", "response"]
    )
    writer.writeheader()
    writer.writerows(rows)

print("结果已保存到 gemma3_4b_reasoning_experiments.csv")
```

## 课堂实验方案

### 实验目标

让学生直观看到 zero-shot、CoT、few-shot 的差异，并初步理解 tree 和 graph 风格提示的用途。

### 实验步骤

1. 固定模型为 `gemma3:4b`
2. 固定温度为低值，例如 `0.2`
3. 先跑 zero-shot
4. 再跑 CoT
5. 再跑 few-shot
6. 最后比较 tree 与 graph 风格

### 建议任务

- 分类任务
- 逻辑推理任务
- 课程设计任务
- 战略决策任务

### 观察点

- 输出是否更稳定
- 推理步骤是否更完整
- 是否更容易发现替代路径
- 输出是否变长但不一定变好

## 课堂流程

1. 先做零样本基线
2. 再加入示例
3. 再加入退一步提问
4. 比较逻辑完整性

## 教师提醒

### 提醒1

few-shot 不是示例越多越好，通常 3 到 5 个高质量示例就够了。

### 提醒2

示例最好有代表性，而且不要都长得完全一样，否则模型容易只学到表面格式。

### 提醒3

做 CoT 推理时，不要把 temperature 调太高，否则逻辑链会变得不稳定。

### 提醒4

tree 和 graph 思路很有启发性，但并不意味着所有任务都该复杂化。简单任务直接 zero-shot 或 few-shot 往往更高效。

## 常见误区

- 误以为示例越多效果越好
- 误以为 CoT 适合所有任务
- 误以为 tree 和 graph 一定比 chain 更高级
- 误以为推理输出更长就代表质量更高
- 误以为 few-shot 只是“举几个例子”，而不是建立评价标准

## 课后延伸

- 用同一任务分别测试 zero-shot、few-shot、CoT、tree、graph 风格
- 自己整理一套常用 few-shot 示例库
- 结合 [推理激发](../../30-知识卡片/10-概念卡/推理激发/) 继续形成个人“复杂任务推理策略表”

## 作业

选择一个高复杂度任务，比较三种推理激发方法，并写出使用建议。

## 可交付成果

- 推理策略对比表

## 关联卡片

- [推理激发](../../30-知识卡片/10-概念卡/推理激发/)

## 配套模板

- [提示词实验模板](../../40-模板/提示词实验模板/)
