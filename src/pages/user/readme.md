# 用户页

## todo

## desgin

操作尽量傻瓜化，实现机制复杂，操作简单

```text
|- 用户列表（无限分级）
   -× 创建用户（弹框）
   -× 停用用户（操作）
   -× 编辑用户（弹框）
   -× 用户列表（页面）

|- 项目组 （待考虑）
  # 每创建一个项目默认有项目组，用户组基于项目组创建

|- 用户组 （无限分级）
   -× 创建用户组（页面）
   -× 停用用户组（操作）
   -× 编辑用户组（页面）
   -× 用户组列表（页面）

|- 权限
  # 权限标示 权限名称 依赖API 对前端进行显示控制

  |- 通用权限
    -× 创建权限（弹框）
    -× 停用权限（操作）
    -× 编辑权限（弹框）
    -× 权限列表（页面）

  |- 业务级权限
    # 需要思考如何注入业务中系统中，是否需要提供接口
```