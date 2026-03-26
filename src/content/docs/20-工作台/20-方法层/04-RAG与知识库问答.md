---
title: 'RAG与知识库问答'
slug: '20-工作台/20-方法层/04-RAG与知识库问答'
---

## 核心问题

模型没有内置事实时，如何接入外部知识降低幻觉。

## 这节学什么

学习把知识检索、证据约束和回答生成连接起来。

## 为什么这节重要

大模型最常见的一个问题是：它看起来什么都懂，但一旦问题涉及你的私有资料、最新文件、内部制度或特定项目，它就很容易一本正经地乱说。

RAG 的价值就在这里。它不是让模型“更聪明”，而是让模型“有依据地回答”。这对知识工作者特别重要，因为很多真实工作并不是要模型即兴发挥，而是要它基于文档、资料和证据给出可靠回复。

## 关键概念

- retrieval
- chunk metadata
- grounding
- answer with citation

## 通俗解释

### 1. 什么是 RAG

RAG 的全称是 `Retrieval-Augmented Generation`，可以直译成“检索增强生成”。

最简单的理解方式是：

- 没有 RAG：模型闭卷答题，主要靠记忆
- 有了 RAG：模型开卷答题，先翻资料再回答

### 2. RAG 解决了什么问题

RAG 主要解决四类问题：

- 私有知识模型没学过
- 最新资料模型可能过时
- 长文档不能整篇直接塞进上下文
- 没有证据时模型容易幻觉

### 3. 为什么 RAG 比直接靠记忆更稳

因为它把回答范围收窄了。模型不需要在整个语言概率空间里“猜”，而是在你给出的相关证据里做整合。

简单说：

- 直接问模型：靠记忆猜
- 先检索再问模型：靠证据答

### 4. 什么是最小可理解的 RAG 工作流

一个最基础的 RAG 可以理解为 5 步：

1. 把文档切块
2. 给每个块建立可检索表示
3. 用户提问
4. 系统找出最相关的几个块
5. 模型只基于这些块生成回答

## 核心概念拆解

### 1. 切块

切块就是把长文拆成小段。

为什么要切：

- 整篇文档太大
- 检索粒度太粗不准
- 小块更容易匹配问题

### 2. 嵌入

嵌入可以理解为：把文字转换成“语义坐标”。

这样系统就不是只看关键词，而是能比较“意思是不是接近”。

### 3. 相似度

相似度就是衡量“这个问题”和“这段资料”在语义上有多接近。

相似度越高，越可能是应该被取出来的证据块。

### 4. 检索

检索就是从很多文本块里，挑出最相关的几个。

它本质上像一个图书管理员，不是替你回答问题，而是替你先找书页。

### 5. 证据约束

证据约束是 RAG 成败的关键之一。

你要明确告诉模型：

- 只能基于以下资料回答
- 如果资料不足，就说不知道
- 不允许补充外部事实

没有这一步，模型仍然会本能地脑补。

### 6. 引用

引用让答案可核查。

理想状态不是只给结论，而是还能告诉你：

- 这个结论来自哪一段
- 哪一句是依据

### 7. 回答生成

最后一步才是模型最擅长的部分：把检索出来的证据组织成人类可读、结构清晰的回答。

## 最小 RAG 工作流

你可以把一个最简单的本地 RAG 想象成下面这个过程：

### 准备阶段

1. 导入文档
2. 分块
3. 给每个块编号
4. 保存块内容和元数据

### 问答阶段

1. 用户输入问题
2. 系统找到最相关的 3 到 5 个块
3. 把这些块和问题一起发给模型
4. 模型根据证据回答
5. 输出答案和引用

## 10个可直接上手的例子

### 例子1：课程知识库问答

资料：课程讲义、PPT、逐字稿  
问题：第三周老师讲的“边际成本”是什么意思？

### 例子2：说明书问答

资料：设备说明书  
问题：设备出现 E1 报错怎么处理？

### 例子3：合同问答

资料：长合同文本  
问题：提前解约的违约责任是什么？

### 例子4：研究资料问答

资料：多篇论文摘要  
问题：这些文献主要用了哪些方法？

### 例子5：公司制度问答

资料：报销制度、考勤制度、请假制度  
问题：加班打车能不能报销？

### 例子6：FAQ 问答

资料：历史客服 FAQ  
问题：账号被锁了怎么办？

### 例子7：财报问答

资料：公司年报  
问题：2022 年亚太区营收是多少？

### 例子8：医疗指南问答

资料：临床指南  
问题：某种情况下推荐的初始治疗是什么？

### 例子9：代码文档问答

资料：接口文档和内部说明  
问题：支付接口的参数结构是什么？

### 例子10：会议纪要追溯

资料：历史会议纪要  
问题：A 功能最终是谁负责、什么时候上线？

## RAG 不是魔法，它最适合哪些任务

RAG 特别适合：

- 事实查找
- 规则问答
- 私有资料问答
- 基于证据的摘要
- 多文档综合

RAG 不一定适合：

- 完全创意写作
- 纯头脑风暴
- 没有文档依据的问题

## 本地测试代码：Ollama + gemma3:4b

先确保模型已经拉取：

```bash
ollama pull gemma3:4b
```

### 方式一：最小“人工 RAG”命令行测试

```bash
ollama run gemma3:4b "请仅根据以下资料回答：当设备显示 E1 错误时，先断电30秒再重启。如果仍报错，检查供电模块。问题：设备报E1怎么处理？如果资料不足请回答证据不足。"
```

### 方式二：PowerShell 最小证据问答

```powershell
$evidence = @"
当设备显示 E1 错误时，先断电 30 秒，再重新启动。
如果仍然报错，请检查供电模块。
"@

$question = "设备报 E1 怎么处理？"

$prompt = @"
请仅根据以下资料回答问题。
如果资料中没有答案，请回答“证据不足”。

资料：
$evidence

问题：
$question
"@

$body = @{
    model = "gemma3:4b"
    prompt = $prompt
    stream = $false
    options = @{
        temperature = 0.1
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

### 方式三：Python 最小人工 RAG

```python
import requests

evidence = """
当设备显示 E1 错误时，先断电 30 秒，再重新启动。
如果仍然报错，请检查供电模块。
"""

question = "设备报 E1 怎么处理？"

prompt = f"""
请仅根据以下资料回答问题。
如果资料中没有答案，请回答“证据不足”。

资料：
{evidence}

问题：
{question}
"""

payload = {
    "model": "gemma3:4b",
    "prompt": prompt,
    "stream": False,
    "options": {
        "temperature": 0.1,
        "top_p": 0.9
    }
}

response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=120)
response.raise_for_status()
print(response.json()["response"])
```

### 方式四：Python 分块函数

```python
def chunk_text(text, chunk_size=300, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


sample_text = "这里替换成长文本材料。" * 100
chunks = chunk_text(sample_text)

for i, chunk in enumerate(chunks[:3], 1):
    print(f"--- chunk {i} ---")
    print(chunk[:120])
```

### 方式五：最小关键词检索

这不是正式向量检索，但很适合教学上帮助学生理解“先找证据，再回答”。

```python
def retrieve_by_keyword(chunks, keyword):
    results = []
    for chunk in chunks:
        if keyword in chunk:
            results.append(chunk)
    return results


chunks = [
    "报销制度：加班打车可报销，需发票。",
    "考勤制度：迟到三次记一次警告。",
    "请假制度：病假需医院证明。"
]

results = retrieve_by_keyword(chunks, "打车")
for item in results:
    print(item)
```

### 方式六：检索后再回答

```python
import requests

URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"

chunks = [
    "报销制度：加班打车可报销，需提供发票，报销上限 80 元。",
    "考勤制度：迟到三次记一次警告。",
    "请假制度：病假需医院证明。"
]

question = "加班打车能不能报销？"

retrieved = [c for c in chunks if "打车" in c or "报销" in c]
evidence = "\n\n".join(retrieved)

prompt = f"""
请仅根据以下证据回答问题。
如果证据不足，请回答“证据不足”。

证据：
{evidence}

问题：
{question}
"""

payload = {
    "model": MODEL,
    "prompt": prompt,
    "stream": False,
    "options": {
        "temperature": 0.1,
        "top_p": 0.9
    }
}

response = requests.post(URL, json=payload, timeout=120)
response.raise_for_status()
print(response.json()["response"])
```

### 方式七：带引用输出

```python
import requests

evidence = """
[片段1] 报销制度：加班打车可报销，需提供发票，报销上限 80 元。
[片段2] 考勤制度：迟到三次记一次警告。
"""

question = "加班打车怎么报销？"

prompt = f"""
请仅根据以下证据回答问题。
回答时必须注明你引用了哪个片段。
如果证据不足，请回答“证据不足”。

证据：
{evidence}

问题：
{question}
"""

payload = {
    "model": "gemma3:4b",
    "prompt": prompt,
    "stream": False,
    "options": {
        "temperature": 0.1,
        "top_p": 0.9
    }
}

response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=120)
response.raise_for_status()
print(response.json()["response"])
```

### 方式八：保存实验结果到 CSV

```python
import csv

rows = [
    {
        "question": "设备报 E1 怎么处理？",
        "evidence_used": "设备说明书片段",
        "result": "回答准确"
    },
    {
        "question": "加班打车能否报销？",
        "evidence_used": "报销制度片段",
        "result": "回答准确"
    }
]

with open("gemma3_4b_rag_experiments.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=["question", "evidence_used", "result"]
    )
    writer.writeheader()
    writer.writerows(rows)

print("结果已保存到 gemma3_4b_rag_experiments.csv")
```

## 课堂实验方案

### 实验目标

让学生直观看到“闭卷回答”和“开卷回答”的差别。

### 实验步骤

1. 先让模型回答一个虚构概念的问题，观察它是否幻觉
2. 再提供一小段明确资料
3. 明确要求“仅根据资料回答”
4. 对比两次输出

### 推荐实验问题

```text
什么是“星渊共振理论”在现代材料学中的应用？
```

然后给出一段说明：

```text
星渊共振理论是科幻小说中的虚构设定，与现实材料学无关。
```

### 观察点

- 模型是否停止编造
- 是否开始依据资料说话
- 是否会明确承认证据不足

## 课堂流程

1. 解释为什么直接问会幻觉
2. 演示检索与回答分离
3. 强调引用和证据约束
4. 讨论 RAG 的失败点

## 教师提醒

### 提醒1

RAG 的质量不只取决于模型，更取决于检索出来的证据质量。

### 提醒2

知识库不是越大越好，脏数据和无关资料会拖累结果。

### 提醒3

如果不写“资料不足时请回答不知道”，模型仍然可能补充外部记忆。

### 提醒4

切块不能完全依赖默认设置，必要时要根据文档结构手动调整。

## 常见误区

- 误以为用了知识库就绝对不会出错
- 误以为文档越多越好
- 误以为检索之后就不需要提示词约束
- 误以为切块只是技术细节，不影响质量
- 误以为 RAG 只能程序员使用

## 课后延伸

- 为你的一个真实知识域设计最小 RAG 工作流
- 比较“全文输入”和“检索后输入”的问答效果
- 结合 [RAG](../../../30-知识卡片/10-概念卡/RAG/) 继续整理个人知识库问答方案

## 作业

围绕一个小型知识域，交付一份 RAG 设计草案。

## 可交付成果

- RAG 流程图
- 问答演示样例

## 配套模板

- [RAG设计模板](../../../40-模板/RAG设计模板/)
