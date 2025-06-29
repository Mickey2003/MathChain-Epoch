#!/bin/bash

# MathChain Epoch 部署脚本

echo "🚀 开始部署 MathChain Epoch..."

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 运行测试
echo "🧪 运行测试..."
npm run test

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 dist/ 目录"
    
    # 显示构建文件大小
    echo "📊 构建文件大小:"
    du -sh dist/*
    
    # 如果有部署目标，可以在这里添加部署命令
    # 例如：rsync -av dist/ user@server:/var/www/mathchain/
    
    echo "🎉 部署完成！"
else
    echo "❌ 构建失败！"
    exit 1
fi

# 移动端构建（可选）
read -p "是否构建移动端应用？(y/n): " build_mobile

if [ "$build_mobile" = "y" ]; then
    echo "📱 构建移动端应用..."
    
    # 初始化Capacitor（如果还没有）
    if [ ! -d "android" ] && [ ! -d "ios" ]; then
        echo "🔧 初始化Capacitor..."
        npx cap init
    fi
    
    # 同步到移动端
    echo "🔄 同步到移动端..."
    npx cap sync
    
    # 询问构建平台
    read -p "构建哪个平台？(android/ios/both): " platform
    
    case $platform in
        android)
            echo "🤖 构建Android应用..."
            npx cap open android
            ;;
        ios)
            echo "🍎 构建iOS应用..."
            npx cap open ios
            ;;
        both)
            echo "📱 构建Android和iOS应用..."
            npx cap open android &
            npx cap open ios &
            ;;
        *)
            echo "⚠️ 无效的平台选择"
            ;;
    esac
fi

echo "🎮 MathChain Epoch 部署完成！"
