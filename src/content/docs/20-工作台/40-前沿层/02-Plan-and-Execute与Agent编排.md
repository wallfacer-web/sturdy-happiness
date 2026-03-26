---
title: 'Plan-and-Execute与Agent编排'
slug: '20-工作台/40-前沿层/02-Plan-and-Execute与Agent编排'
---

## 核心问题

怎样把“先规划再执行”做成较稳定的 agent 模式。

## 这节学什么

学习把规划器和执行器分开，减少长任务中的混乱。

## 关键概念

- planner
- executor
- reflection
- retries

## 典型练习

让模型先列计划，再逐步执行并对失败环节重试。

## 最小示例

第一步只输出计划，第二步逐条执行，第三步对失败环节反思并重试。

## 课堂流程

1. 先观察一步到位 agent 的问题
2. 再拆成 planner 和 executor
3. 再增加反思与重试

## 作业

围绕一个真实任务画出 plan-and-execute 流程图。

## 可交付成果

- Agent 执行流程图

## 配套模板

- [智能体设计模板](../../../40-模板/智能体设计模板/)
