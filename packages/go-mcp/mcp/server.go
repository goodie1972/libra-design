package mcp

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
)

const (
	protocolVersion = "2024-11-05"
	serverName      = "libra-mcp"
	serverVersion   = "0.1.0"
)

// Server 管理 MCP 协议连接
type Server struct {
	reader *bufio.Reader
	writer io.Writer
	logger *log.Logger
}

// NewServer 创建新的 MCP Server（stdio 传输）
func NewServer() *Server {
	return &Server{
		reader: bufio.NewReader(os.Stdin),
		writer: os.Stdout,
		logger: log.New(os.Stderr, "[libra-mcp] ", log.LstdFlags),
	}
}

// Run 启动 server，阻塞直到 stdin 关闭
func (s *Server) Run() error {
	for {
		line, err := s.reader.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return fmt.Errorf("读取请求失败: %w", err)
		}
		s.handleMessage(line)
	}
}

func (s *Server) handleMessage(data []byte) {
	var req JSONRPCRequest
	if err := json.Unmarshal(data, &req); err != nil {
		s.logger.Printf("JSON 解析失败: %v", err)
		return
	}

	if req.JSONRPC != "2.0" {
		s.logger.Printf("非 JSON-RPC 2.0 消息: %s", req.JSONRPC)
		return
	}

	result, err := s.dispatch(&req)
	if err != nil {
		s.logger.Printf("方法 %s 失败: %v", req.Method, err)
		if req.IsNotification() {
			return // 通知不需要错误响应
		}
		errResp := JSONRPCResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error: &JSONRPCError{
				Code:    -32603,
				Message: err.Error(),
			},
		}
		respJSON, _ := json.Marshal(errResp)
		fmt.Fprintf(s.writer, "%s\n", respJSON)
		return
	}

	// 通知不返回响应
	if req.IsNotification() {
		return
	}

	resp := JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      req.ID,
		Result:  result,
	}
	respJSON, _ := json.Marshal(resp)
	fmt.Fprintf(s.writer, "%s\n", respJSON)
}

func (s *Server) dispatch(req *JSONRPCRequest) (json.RawMessage, error) {
	switch req.Method {
	case "initialize":
		return s.handleInitialize()
	case "initialized":
		// 客户端就绪通知，无需响应
		return nil, nil
	case "tools/list":
		return s.handleListTools()
	case "tools/call":
		return s.handleCallTool(req.Params)
	case "resources/list":
		return s.handleListResources()
	case "resources/read":
		return s.handleReadResource(req.Params)
	case "ping":
		return json.RawMessage(`{}`), nil
	default:
		return nil, fmt.Errorf("未知方法: %s", req.Method)
	}
}

func (s *Server) handleInitialize() (json.RawMessage, error) {
	result := InitializeResult{
		ProtocolVersion: protocolVersion,
		ServerInfo: ServerInfo{
			Name:    serverName,
			Version: serverVersion,
		},
		Capabilities: ServerCapabilities{
			Tools:     &CapTools{ListChanged: false},
			Resources: &CapResources{Subscribe: false, ListChanged: false},
		},
	}
	data, err := json.Marshal(result)
	return json.RawMessage(data), err
}

func (s *Server) handleListTools() (json.RawMessage, error) {
	result := ListToolsResult{Tools: registerTools()}
	data, err := json.Marshal(result)
	return json.RawMessage(data), err
}

func (s *Server) handleCallTool(params json.RawMessage) (json.RawMessage, error) {
	var p CallToolParams
	if err := json.Unmarshal(params, &p); err != nil {
		return nil, fmt.Errorf("参数解析失败: %w", err)
	}

	result, err := callTool(p.Name, p.Arguments)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(result)
	return json.RawMessage(data), err
}

func (s *Server) handleListResources() (json.RawMessage, error) {
	result := ListResourcesResult{Resources: registerResources()}
	data, err := json.Marshal(result)
	return json.RawMessage(data), err
}

func (s *Server) handleReadResource(params json.RawMessage) (json.RawMessage, error) {
	var p ReadResourceParams
	if err := json.Unmarshal(params, &p); err != nil {
		return nil, fmt.Errorf("参数解析失败: %w", err)
	}

	result, err := readResource(p.URI)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(result)
	return json.RawMessage(data), err
}
