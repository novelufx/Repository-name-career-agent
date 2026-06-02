# API 设计文档

> 更新日期：2026-06-02

---

## 一、为什么选择小米 MiMo

选小米 MiMo 主要是几个考虑：

它是国产大模型，API 服务在国内，访问速度快，不用翻墙。对于面向大学生的产品来说，这点很重要。

它兼容 Anthropic Messages 格式，请求和响应的结构都比较规范，前端解析方便。

价格相对合理，适合个人项目和学生使用。

---

## 二、前端静态部署下的 API Key 处理

CareerAgent 是纯前端项目，部署在 GitHub Pages 上，没有后端。API Key 只能存在前端。

处理方式是：API Key 存在浏览器的 localStorage 里，每次调用 API 时从 localStorage 读取，放到请求头里发给小米 MiMo 的服务器。

好处是简单，不需要后端。坏处是 API Key 暴露在前端，有被其他人看到的风险。但对于个人项目和作品集来说，这个风险可以接受。

如果以后要做成正式产品，需要加一个后端代理，把 API Key 放在后端环境变量里。

---

## 三、用户配置项

用户在设置页可以配置三个东西：

- API Key：小米 MiMo 的 API Key，默认为空（演示模式）
- Base URL：API 的基础地址，默认 `https://token-plan-cn.xiaomimimo.com/anthropic`
- 模型名：使用的模型，默认 `mimo-v2-pro`

如果用户不填 API Key，系统自动使用演示模式，返回预设的 mock 数据。

---

## 四、localStorage 存储方案

存储的键名：

- `career_agent_api_key`：API Key
- `career_agent_base_url`：Base URL
- `career_agent_model`：模型名
- `career_agent_use_mock_mode`：是否使用演示模式

读取逻辑：优先从 localStorage 读取，如果没有就用默认值。如果没有 API Key，强制使用演示模式。

写入逻辑：用户在设置页点击"保存"时写入，同时更新内存中的状态。

---

## 五、callMiMoChat 方法说明

核心调用方法在 `src/services/aiService.ts` 里。

它做的事情：
1. 从 localStorage 读取配置
2. 拼接请求地址：`baseUrl + "/v1/messages"`
3. 构建请求体，使用 Anthropic Messages 格式
4. 发送 POST 请求，带上 Authorization 头
5. 解析响应，提取 `content` 数组中 `type: "text"` 的内容
6. 返回文本结果

请求体格式：

```json
{
  "model": "mimo-v2-pro",
  "messages": [
    { "role": "user", "content": "..." }
  ],
  "max_tokens": 2000,
  "temperature": 0.3
}
```

响应格式（Anthropic Messages）：

```json
{
  "id": "...",
  "type": "message",
  "role": "assistant",
  "model": "mimo-v2-pro",
  "content": [
    { "type": "text", "text": "AI 的回复内容" }
  ],
  "usage": {
    "input_tokens": 60,
    "output_tokens": 80
  }
}
```

---

## 六、Mock 模式和真实 API 切换

切换逻辑很简单。检查用户是否开启了演示模式，或者没有填 API Key。

每个业务方法（analyzeJD、diagnoseResume 等）内部都这样处理：

1. 检查是否演示模式，如果是，返回 mock 数据
2. 尝试调用真实 API
3. 如果失败，降级到 mock 数据

这样的好处是：用户不填 API Key 也能体验完整功能，API 调用失败时不会白屏，开发阶段方便调试。

---

## 七、错误处理

错误处理分几层：

网络错误：fetch 失败时，捕获错误，提示"网络错误，请检查网络连接"。

API 错误：响应状态码不是 200 时，根据状态码给出提示：
- 401：API Key 无效
- 403：访问被拒绝
- 404：API 地址错误
- 429：请求过于频繁
- 500：服务器错误

解析错误：AI 返回的不是 JSON 时，尝试用正则提取 JSON 块。如果还是失败，返回 mock 数据。

兜底策略：所有错误都会降级到 mock 数据，保证页面不会白屏。

---

## 八、安全注意事项

### API Key 安全

- 只存在 localStorage，不写入源码
- 不上传到任何服务器
- 设置页显示时用 password 类型，支持显示/隐藏切换

### 请求安全

- 使用 HTTPS
- API Key 放在 Authorization header
- 不在 URL 中传递 API Key

### 数据安全

- 用户输入的简历内容不持久化存储
- 所有数据处理在前端完成
- 不收集用户数据

### 已知风险

API Key 在前端可见，有被其他人看到的风险。如果要做成正式产品，需要加后端代理。

---

## 九、后续如果要做后端代理

如果以后要加后端代理，改造方案：

架构变化：前端 → 后端代理 → 小米 MiMo API

后端用 Node.js + Express 搭建一个简单的代理服务，从环境变量读取 API Key，转发前端的请求。

前端只需要把 Base URL 改成后端地址就行，其他代码不用动。

好处：
- API Key 不暴露在前端
- 可以做请求限流
- 可以记录使用日志
- 可以做用户认证

---

## 十、相关文件

- `src/services/aiService.ts`：AI 服务核心逻辑
- `src/services/settingsService.ts`：配置读写
- `src/types/api.ts`：类型定义
- `src/utils/responseParser.ts`：响应解析工具
- `src/prompts/*.ts`：Prompt 模板
