# FAQ CMS System TODO

## 后端 API
- [x] FAQ 数据库表设计（faqs、faq_versions、faq_images）
- [x] FAQ 数据库操作函数（faq-db.ts）
- [x] tRPC FAQ 路由（create、update、delete、publish、unpublish）
- [x] 版本控制 API（getVersionHistory、restoreVersion）
- [x] 图片管理 API（uploadImage、deleteImage、updateImage）

## 前端编辑器
- [x] FAQEditor 组件（多语言、富文本、图片上传）
- [x] Quill 富文本编辑器集成
- [x] 图片上传和管理界面

## FAQ 管理后台
- [x] FAQ 列表页面（显示所有 FAQ、搜索、过滤、分页）
- [x] 编辑/删除操作按钮
- [x] 草稿/已发布状态指示
- [x] 版本历史查看和回滚
- [ ] 批量操作（批量发布、批量删除）

## 发布工作流
- [ ] 草稿预览功能
- [x] 一键发布/取消发布
- [x] 发布确认对话框
- [ ] 发布历史记录

## 首页集成
- [x] 使用 tRPC 查询已发布 FAQ
- [x] 搜索功能（全文搜索）
- [x] 分类过滤（按产品类型、应用场景）
- [x] FAQ 列表展示
- [x] 自动更新（实时同步数据库变化）

## 优化和测试
- [ ] API 单元测试
- [ ] 前端组件测试
- [ ] 性能优化（缓存、分页）
- [ ] 错误处理和用户提示
- [ ] 响应式设计验证
