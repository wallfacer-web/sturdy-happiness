---
title: 'LLM生成机制与参数实验'
slug: '20-工作台/10-基础层/01-LLM生成机制与参数实验'
---

## 核心问题

为什么同一个任务会出现不同答案，参数变化会怎样影响输出质量。

## 这节学什么

学习模型输出并不是固定答案，而是受上下文和采样参数影响的生成过程。

## 为什么这节重要

很多初学者把大模型当成“会说话的搜索框”或“稳定的答案机器”。这会导致两个常见误判：

1. 以为同一个问题应该永远得到同一个答案
2. 以为答案不稳定就是模型“坏了”

这节课要建立一个更准确的理解：大语言模型本质上是一个根据上下文预测下一个 token 的概率系统。它不是在“查唯一标准答案”，而是在一组可能输出中做生成。理解这一点，后面才谈得上提示词优化、参数调节和评测。

## 关键概念

- token
- 上下文窗口
- temperature
- top_p

## 通俗解释

### 1. 什么是 token

token 可以理解为模型处理文本时使用的最小积木块。它不一定等于一个汉字，也不一定等于一个完整单词。对模型来说，输入和输出都要先拆成 token，再进行计算。

这件事为什么重要：

- 成本通常和 token 数量有关
- 上下文窗口通常也是按 token 计算
- 提示词过长、废话过多，会直接挤占模型真正处理任务的空间

### 2. 什么是上下文窗口

上下文窗口可以理解为模型单次工作的“工作记忆”。它要同时容纳：

- 你的系统提示
- 用户输入
- 对话历史
- 模型已经生成的内容

如果材料太长，模型就可能“忘掉前面说过的话”，或者根本处理不完。这就是为什么长文档任务不能只靠“整篇粘贴进去”，而要学会切块、摘要、筛选和组织上下文。

### 3. 什么是 temperature

`temperature` 决定模型输出时的随机性和发散程度。

- 低温度：更保守，更稳定，更接近高概率答案
- 中等温度：兼顾自然度和变化
- 高温度：更发散，更有创造性，也更容易跑偏

可以把它理解为“自由发挥程度”的旋钮。

### 4. 什么是 top_p

`top_p` 控制模型从多大范围的候选词里挑选。它不是直接控制“大胆不大胆”，而是控制“候选池有多宽”。

- 低 `top_p`：只在最有把握的一小批词里选
- 高 `top_p`：会把更多低概率词纳入候选

一般教学上不建议初学者同时猛调 `temperature` 和 `top_p`，因为这样很难判断到底是哪个参数导致了变化。

### 5. 为什么同一任务会出现不同答案

因为模型不是从数据库里拿固定答案，而是在概率分布里做采样。只要存在采样，输出就可能波动。再加上：

- 提示词写法本身不够清楚
- 上下文不同
- 参数不同
- 模型版本不同

同一个任务就可能得到不完全一样的结果。

## 典型练习

对同一个问题分别设置不同参数，观察准确性、发散性和稳定性。

## 最小示例

任务不变，只调整 `temperature=0.2` 和 `temperature=1.0`，比较答案是否更稳定或更发散。

## 8个可直接上手的任务例子

### 例子1：信息提取

任务：从一段会议纪要中提取“时间、地点、参与者、待办事项”。

建议：

- `temperature=0.0-0.2`
- 输出格式固定为表格或 JSON

原因：这类任务追求稳定和准确，不需要创造性。

### 例子2：事实性摘要

任务：总结一篇论文的研究问题、方法、结论和局限。

建议：

- `temperature=0.1-0.4`
- 要求基于原文，不允许补充未提及信息

原因：摘要允许适度重组语言，但不能乱扩展。

### 例子3：文本分类

任务：把用户反馈分为“功能问题、价格问题、体验问题、其他”。

建议：

- `temperature=0.0-0.2`
- 给定固定标签集

原因：分类任务本质上要像规则化判别器，而不是创意写作器。

### 例子4：教学解释

任务：用高中生能听懂的话解释“什么是向量数据库”。

建议：

- `temperature=0.5-0.7`
- 要求给比喻、最小例子和误区

原因：既要守住概念底线，也要有一点表达弹性。

### 例子5：商务写作

任务：把零散要点整理成正式邮件。

建议：

- `temperature=0.3-0.5`
- 明确语气、对象、篇幅和格式

原因：写作需要自然，但不应太发散。

### 例子6：创意文案

任务：给一款新产品生成 10 条广告语。

建议：

- `temperature=0.8-1.0`
- 可以提高 `top_p`

原因：这类任务需要多样性，允许新奇表达。

### 例子7：代码生成

任务：写一段 Python 代码，清洗 CSV 中的空值并输出统计结果。

建议：

- `temperature=0.1-0.3`
- 要求输出可运行代码和简短注释

原因：代码容错率低，过度发散会直接导致错误。

### 例子8：头脑风暴

任务：为“提示词工程”课程想 15 个期末项目方向。

建议：

- `temperature=0.9-1.1`
- 要求避免重复，尽量拉开风格

原因：这里追求的是广度和新意，而不是唯一正确答案。

## 参数使用建议

### 低温度更适合什么

- 信息提取
- 分类
- 翻译
- 代码生成
- 事实性摘要

### 中等温度更适合什么

- 一般写作
- 教学解释
- 常规对话
- 方案整理

### 高温度更适合什么

- 头脑风暴
- 创意写作
- 广告文案
- 角色化表达

## 本地测试代码：Ollama + gemma3:4b

下面给出一套适合学习者直接上手的本地实验代码。默认你已经安装了 Ollama，并且已经拉取模型：

```bash
ollama pull gemma3:4b
```

### 方式一：命令行快速测试

先做一个最简单的单次测试：

```bash
ollama run gemma3:4b "请用三句话解释什么是 temperature 参数。"
```

如果你要比较不同参数，更推荐直接调用 Ollama 的本地 HTTP 接口。

### 方式二：PowerShell 调用本地 API

这段代码适合 Windows 学习者直接复制运行。

```powershell
$body = @{
    model = "gemma3:4b"
    prompt = "请写一个150字以内的小故事，主角是一只会说话的猫。"
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

### 方式三：Python 单次测试代码

这段代码最适合后续批量实验，因为容易循环、保存结果和做对比。

```python
import requests

url = "http://localhost:11434/api/generate"

payload = {
    "model": "gemma3:4b",
    "prompt": "请写一个150字以内的小故事，主角是一只会说话的猫。",
    "stream": False,
    "options": {
        "temperature": 0.2,
        "top_p": 0.9
    }
}

response = requests.post(url, json=payload, timeout=120)
response.raise_for_status()

data = response.json()
print(data["response"])
```

### 方式四：完整参数实验代码

下面这段 Python 代码会自动测试三组 `temperature`，每组连续生成 3 次，便于学习者直接观察稳定性和创造性的差异。

```python
import requests
from textwrap import shorten

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"
PROMPT = "请写一个150字以内的小故事，主角是一只会说话的猫。"

temperature_values = [0.0, 0.6, 1.0]
top_p = 0.9
repeat_times = 3


def generate(prompt, temperature, top_p):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "top_p": top_p
        }
    }
    response = requests.post(URL, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["response"].strip()


for temp in temperature_values:
    print("=" * 80)
    print(f"temperature = {temp}, top_p = {top_p}")
    print("=" * 80)
    for i in range(repeat_times):
        result = generate(PROMPT, temp, top_p)
        print(f"\n--- 第 {i + 1} 次生成 ---")
        print(result)
        print("\n摘要观察：", shorten(result.replace("\n", " "), width=80, placeholder="..."))
```

### 方式五：把结果保存成 CSV

如果要提交作业或做课堂展示，建议直接保存结果。

```python
import csv
import requests

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"
PROMPT = "请写一个150字以内的小故事，主角是一只会说话的猫。"

temperature_values = [0.0, 0.6, 1.0]
top_p = 0.9
repeat_times = 3


def generate(prompt, temperature, top_p):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "top_p": top_p
        }
    }
    response = requests.post(URL, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["response"].strip()


rows = []
for temp in temperature_values:
    for i in range(repeat_times):
        result = generate(PROMPT, temp, top_p)
        rows.append({
            "model": MODEL,
            "prompt": PROMPT,
            "temperature": temp,
            "top_p": top_p,
            "run_index": i + 1,
            "response": result
        })

with open("gemma3_4b_temperature_experiment.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=["model", "prompt", "temperature", "top_p", "run_index", "response"]
    )
    writer.writeheader()
    writer.writerows(rows)

print("实验结果已保存到 gemma3_4b_temperature_experiment.csv")
```

## 可直接替换的实验提示词

为了让学习者看到不同任务对参数的敏感性，建议把上面的 `PROMPT` 分别替换成下面这些任务。

### 任务1：信息提取

```text
请从下面这段会议纪要中提取时间、地点、参与者和待办事项，并用 JSON 输出：
周三下午3点，项目组在明德楼302开会，参会人有张敏、王凯、刘晨。决定下周一前完成课程首页初稿。
```

### 任务2：事实性摘要

```text
请把下面这段材料总结为3点结论，每点不超过40字，并补充1点局限：
[把一段文章贴在这里]
```

### 任务3：分类

```text
请判断下面这条用户反馈属于哪一类，只能输出一个标签：功能问题、价格问题、体验问题、其他。
用户反馈：这个软件功能很多，但界面太乱，我找半天才找到导出按钮。
```

### 任务4：教学解释

```text
请用高中生能听懂的话解释什么是向量数据库，并给一个生活化例子。
```

### 任务5：创意生成

```text
请为一门《提示词工程》课程设计10个不同风格的期末项目题目，要求不要重复。
```

## 建议学习者怎么跑实验

### 第一步

先固定提示词，只改 `temperature`。

### 第二步

记录每组参数下生成 3 次的结果。

### 第三步

比较：

- 是否更稳定
- 是否更丰富
- 是否更容易跑题
- 是否更适合当前任务

### 第四步

再固定 `temperature`，改 `top_p`，做第二轮对比。

## 教师版实验建议

如果你要带学生上机，建议这样安排：

1. 全班统一模型：`gemma3:4b`
2. 全班统一提示词
3. 第一轮只调 `temperature`
4. 第二轮只调 `top_p`
5. 最后讨论“不同任务为什么参数策略不同”

这样学生更容易观察规律，而不是陷入“我这里和别人不一样是不是出错了”的困惑。

## 课堂实验方案

### 实验目标

观察 `temperature` 变化如何影响同一提示词在稳定性、创造性和逻辑性上的表现。

### 实验材料

选择一个开放但不太复杂的提示词，例如：

```text
请写一个 150 字以内的小故事，主角是一只会说话的猫。
```

### 实验设置

- 保持提示词不变
- 保持 `top_p` 默认不变
- 只调整 `temperature`
- 每组参数连续生成 3 次
- 本地统一使用 `ollama` 的 `gemma3:4b`

### 实验步骤

1. 设置 `temperature=0.0`
2. 连续生成 3 次并记录结果
3. 设置 `temperature=0.6`
4. 连续生成 3 次并记录结果
5. 设置 `temperature=1.0`
6. 连续生成 3 次并记录结果
7. 对比三组结果的稳定性、创造性和逻辑完整度

### 记录维度

- 是否每次结果都高度相似
- 词汇是否更丰富
- 情节是否更有变化
- 是否出现明显跑题
- 是否出现不连贯或胡编

### 观察点

- `temperature=0.0` 时，结果通常最稳定，但容易保守
- `temperature=0.6` 时，通常兼顾自然和变化
- `temperature=1.0` 时，结果更有新意，但更容易失控

### 建议记录表

| 参数组 | 第1次输出 | 第2次输出 | 第3次输出 | 稳定性 | 创造性 | 逻辑性 | 备注 |
|---|---|---|---|---|---|---|---|
| temp=0.0 |  |  |  |  |  |  |  |
| temp=0.6 |  |  |  |  |  |  |  |
| temp=1.0 |  |  |  |  |  |  |  |

## 课堂流程

1. 先用一个简单任务做基线提问
2. 再逐项调整参数
3. 记录输出差异
4. 讨论什么任务适合低温度，什么任务适合高温度

## 教师提醒

### 提醒1

不要一上来同时调整 `temperature` 和 `top_p`。先只动一个参数，否则学生很难判断结果变化来自哪里。

### 提醒2

不要把“更有创造性”误解为“更好”。对于提取、分类、翻译、代码等任务，稳定往往比华丽更重要。

### 提醒3

不要把超长背景一次性全塞给模型。上下文窗口有限，太多无关材料只会稀释注意力。

### 提醒4

要让学生意识到 token 不只是技术词，而是和成本、速度、上下文容量直接相关。

## 常见误区

- 误以为同一问题一定要有唯一答案
- 误以为参数越高模型越“聪明”
- 误以为把上下文加长就一定更好
- 误以为只要 prompt 写得长，结果就会更稳定
- 误以为创造性任务和事实性任务可以用同一套参数

## 课后延伸

- 尝试把同一个任务分别改成“提取型”“解释型”“创意型”，比较参数策略是否变化
- 尝试在不改参数的情况下，只改提示词结构，观察结果变化
- 结合 [结构化提示词](../../../30-知识卡片/10-概念卡/结构化提示词/) 思考：参数和提示词结构，哪个更重要

## 作业

选择一个你自己的真实任务，至少测试三组参数组合，并写出结论。

## 可交付成果

- 参数实验记录表
- 输出差异分析

## 配套模板

- [提示词实验模板](../../../40-模板/提示词实验模板/)

## 关联卡片

- [LLM交互基础](../../../30-知识卡片/10-概念卡/LLM交互基础/)
- [结构化提示词](../../../30-知识卡片/10-概念卡/结构化提示词/)
