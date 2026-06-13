// Package mcp 实现 MCP (Model Context Protocol) JSON-RPC 2.0 over stdio。
// 仅使用 Go 标准库——零外部依赖。
package mcp

import "encoding/json"

// JSONRPCRequest 接收自客户端的请求
type JSONRPCRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      *int            `json:"id,omitempty"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

// JSONRPCResponse 返回给客户端的响应
type JSONRPCResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      *int            `json:"id,omitempty"`
	Result  json.RawMessage `json:"result,omitempty"`
	Error   *JSONRPCError   `json:"error,omitempty"`
}

// JSONRPCError JSON-RPC 错误信息
type JSONRPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

// IsNotification 判断是否为通知（无 id 字段）
func (r *JSONRPCRequest) IsNotification() bool {
	return r.ID == nil
}

// ---- MCP 特定类型 ----

// InitializeParams 初始化参数
type InitializeParams struct {
	ProtocolVersion string             `json:"protocolVersion"`
	Capabilities    ClientCapabilities `json:"capabilities"`
	ClientInfo      ClientInfo         `json:"clientInfo"`
}

// ClientCapabilities 客户端能力
type ClientCapabilities struct {
	Roots    *CapRoots    `json:"roots,omitempty"`
	Sampling *CapSampling `json:"sampling,omitempty"`
}

// CapRoots roots 能力
type CapRoots struct {
	ListChanged bool `json:"listChanged,omitempty"`
}

// CapSampling sampling 能力
type CapSampling struct{}

// ClientInfo 客户端信息
type ClientInfo struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

// InitializeResult 初始化响应
type InitializeResult struct {
	ProtocolVersion string             `json:"protocolVersion"`
	Capabilities    ServerCapabilities `json:"capabilities"`
	ServerInfo      ServerInfo         `json:"serverInfo"`
}

// ServerCapabilities 服务端能力
type ServerCapabilities struct {
	Tools     *CapTools     `json:"tools,omitempty"`
	Resources *CapResources `json:"resources,omitempty"`
}

// CapTools tools 能力
type CapTools struct {
	ListChanged bool `json:"listChanged,omitempty"`
}

// CapResources resources 能力
type CapResources struct {
	Subscribe   bool `json:"subscribe,omitempty"`
	ListChanged bool `json:"listChanged,omitempty"`
}

// ServerInfo 服务端信息
type ServerInfo struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

// ---- Tools ----

// ListToolsResult tools/list 响应
type ListToolsResult struct {
	Tools []Tool `json:"tools"`
}

// Tool 工具定义
type Tool struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	InputSchema InputSchema `json:"inputSchema"`
}

// InputSchema 工具输入参数的 JSON Schema
type InputSchema struct {
	Type       string              `json:"type"`
	Properties map[string]Property `json:"properties,omitempty"`
	Required   []string            `json:"required,omitempty"`
}

// Property 参数属性定义
type Property struct {
	Type        string `json:"type"`
	Description string `json:"description"`
}

// CallToolParams tools/call 参数
type CallToolParams struct {
	Name      string          `json:"name"`
	Arguments json.RawMessage `json:"arguments,omitempty"`
}

// CallToolResult tools/call 响应
type CallToolResult struct {
	Content []ContentItem `json:"content"`
}

// ContentItem 工具调用返回的内容
type ContentItem struct {
	Type string `json:"type"`
	Text string `json:"text,omitempty"`
}

// ---- Resources ----

// ListResourcesResult resources/list 响应
type ListResourcesResult struct {
	Resources []Resource `json:"resources"`
}

// Resource 资源定义
type Resource struct {
	URI         string `json:"uri"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	MimeType    string `json:"mimeType,omitempty"`
}

// ReadResourceParams resources/read 参数
type ReadResourceParams struct {
	URI string `json:"uri"`
}

// ReadResourceResult resources/read 响应
type ReadResourceResult struct {
	Contents []ResourceContent `json:"contents"`
}

// ResourceContent 资源内容
type ResourceContent struct {
	URI      string `json:"uri"`
	MimeType string `json:"mimeType,omitempty"`
	Text     string `json:"text,omitempty"`
}
