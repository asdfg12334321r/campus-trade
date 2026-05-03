/* ==================== Supabase 配置 ==================== */
const SUPABASE_URL = 'https://bgoasiasxwxbfuermxwm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aieCgH5hguy14TganpPUwQ_VWiMH4K3';

// 初始化 Supabase 客户端
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== 全局变量 ====================
let currentData = [];

// ==================== 工具函数 ====================

/**
 * 显示消息提示
 * @param {string} text - 提示文本
 * @param {string} type - 提示类型 (info/success/error)
 */
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message show message-${type}`;
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

/**
 * 显示加载状态
 */
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>
    `;
}

/**
 * 显示空状态
 */
function showEmpty(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <h3>暂无数据</h3>
            <p>点击上方查询按钮来获取数据</p>
        </div>
    `;
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
}

/**
 * 格式化价格
 */
function formatPrice(price) {
    return parseFloat(price || 0).toFixed(2);
}

// ==================== 商品相关函数 ====================

/**
 * 查询所有未售出商品 (status=0)
 */
async function queryAllUnsoldItems() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .eq('status', 0)
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！找到 ${data?.length || 0} 件未售商品`, 'success');
    } catch (error) {
        console.error('查询未售商品失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询价格大于30的商品
 */
async function queryItemsAbovePrice() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .gt('price', 30)
            .order('price', { ascending: false });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！找到 ${data?.length || 0} 件价格>30元的商品`, 'success');
    } catch (error) {
        console.error('查询价格商品失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询生活用品类（DailyGoods）商品
 */
async function queryDailyGoodsItems() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .eq('category', 'DailyGoods')
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！找到 ${data?.length || 0} 件生活用品`, 'success');
    } catch (error) {
        console.error('查询生活用品失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询指定用户发布的所有商品
 */
async function queryItemsByUser(userId) {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .eq('seller_id', userId)
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！${userId} 发布了 ${data?.length || 0} 件商品`, 'success');
    } catch (error) {
        console.error('查询用户商品失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 显示所有商品
 */
async function showAllItems() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`加载成功！共 ${data?.length || 0} 件商品`, 'success');
    } catch (error) {
        console.error('加载商品失败:', error);
        showMessage('加载失败: ' + error.message, 'error');
    }
}

/**
 * 查询视图：已售商品视图
 */
async function queryViewSoldItems() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .eq('status', 1)
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！共 ${data?.length || 0} 件已售商品`, 'success');
    } catch (error) {
        console.error('查询已售商品视图失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询视图：未售商品视图
 */
async function queryViewUnsoldItems() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('*')
            .eq('status', 0)
            .order('item_id', { ascending: true });

        if (error) throw error;
        
        renderItemsTable(data, 'contentContainer');
        showMessage(`查询成功！共 ${data?.length || 0} 件未售商品`, 'success');
    } catch (error) {
        console.error('查询未售商品视图失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 统计商品总数
 */
async function queryItemCount() {
    showLoading('contentContainer');
    try {
        const { count } = await supabase
            .from('item')
            .select('*', { count: 'exact', head: true });

        showMessage(`统计成功！商品总数: ${count || 0}`, 'success');
        renderStatInfo(`商品总数: <strong>${count || 0}</strong>`);
    } catch (error) {
        console.error('统计商品总数失败:', error);
        showMessage('统计失败: ' + error.message, 'error');
    }
}

/**
 * 统计每类商品数量
 */
async function queryItemCountByCategory() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('category');

        if (error) throw error;

        // 统计每类商品
        const categoryCount = {};
        data?.forEach(item => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        });

        // 创建统计表格
        let html = '<div class="category-stats">';
        for (const [category, count] of Object.entries(categoryCount)) {
            html += `
                <div class="category-item">
                    <div class="count">${count}</div>
                    <div class="name">${category}</div>
                </div>
            `;
        }
        html += '</div>';

        document.getElementById('contentContainer').innerHTML = html;
        showMessage(`统计成功！共 ${Object.keys(categoryCount).length} 类商品`, 'success');
    } catch (error) {
        console.error('统计分类商品失败:', error);
        showMessage('统计失败: ' + error.message, 'error');
    }
}

/**
 * 计算所有商品平均价格
 */
async function queryAvgItemPrice() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('item')
            .select('price');

        if (error) throw error;

        if (!data || data.length === 0) {
            renderStatInfo('暂无商品数据');
            return;
        }

        const sum = data.reduce((acc, item) => acc + item.price, 0);
        const avgPrice = (sum / data.length).toFixed(2);

        renderStatInfo(`
            平均价格: <strong>¥${avgPrice}</strong><br>
            商品总数: <strong>${data.length}</strong><br>
            总价值: <strong>¥${sum.toFixed(2)}</strong>
        `);
        showMessage(`统计成功！平均价格: ¥${avgPrice}`, 'success');
    } catch (error) {
        console.error('计算平均价格失败:', error);
        showMessage('统计失败: ' + error.message, 'error');
    }
}

/**
 * 渲染商品表格
 */
function renderItemsTable(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!items || items.length === 0) {
        showEmpty(containerId);
        return;
    }

    currentData = items;
    let html = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>商品ID</th>
                        <th>商品名称</th>
                        <th>分类</th>
                        <th>价格(元)</th>
                        <th>状态</th>
                        <th>卖家ID</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
    `;

    items.forEach(item => {
        const statusBadge = item.status === 0 
            ? '<span class="status-badge status-unsold">出售中</span>'
            : '<span class="status-badge status-sold">已售出</span>';
        
        const buyBtnState = item.status === 0 ? '' : 'disabled';
        
        html += `
            <tr>
                <td>${item.item_id}</td>
                <td>${item.item_name}</td>
                <td>${item.category}</td>
                <td>¥${item.price}</td>
                <td>${statusBadge}</td>
                <td>${item.seller_id}</td>
                <td>
                    <button class="action-btn action-btn-buy" 
                            onclick="buyItem('${item.item_id}', '${item.item_name}', '${item.price}')"
                            ${buyBtnState}>
                        ${item.status === 0 ? '🛒 购买' : '已售'}
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== 用户相关函数 ====================

/**
 * 查询发布商品数量最多的用户
 */
async function queryMostActiveUser() {
    showLoading('contentContainer');
    try {
        // 获取所有用户
        const { data: users, error: userError } = await supabase
            .from('user')
            .select('user_id, user_name, phone');

        if (userError) throw userError;

        if (!users || users.length === 0) {
            renderUsersTable([], 'contentContainer');
            showMessage('暂无用户数据', 'info');
            return;
        }

        // 统计每个用户发布的商品数
        const { data: items } = await supabase
            .from('item')
            .select('seller_id, item_id');

        // 构建商品计数
        const itemCount = {};
        items?.forEach(item => {
            itemCount[item.seller_id] = (itemCount[item.seller_id] || 0) + 1;
        });

        // 添加计数信息
        const usersWithCount = users.map(user => ({
            ...user,
            item_count: itemCount[user.user_id] || 0
        }));

        // 按商品数排序
        usersWithCount.sort((a, b) => b.item_count - a.item_count);

        // 显示前10个最活跃用户
        const topUsers = usersWithCount.slice(0, 10);
        renderUsersTable(topUsers, 'contentContainer');
        
        const mostActiveUser = usersWithCount[0];
        showMessage(`查询成功！${mostActiveUser.user_name} 发布商品最多，共 ${mostActiveUser.item_count} 件`, 'success');
    } catch (error) {
        console.error('查询最活跃用户失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 显示所有用户
 */
async function showAllUsers() {
    showLoading('contentContainer');
    try {
        // 获取所有用户
        const { data: users, error: userError } = await supabase
            .from('user')
            .select('user_id, user_name, phone');

        if (userError) throw userError;

        if (!users || users.length === 0) {
            renderUsersTable([], 'contentContainer');
            showMessage('暂无用户数据', 'info');
            return;
        }

        // 统计每个用户发布的商品数
        const { data: items } = await supabase
            .from('item')
            .select('seller_id, item_id');

        // 构建商品计数
        const itemCount = {};
        items?.forEach(item => {
            itemCount[item.seller_id] = (itemCount[item.seller_id] || 0) + 1;
        });

        // 添加计数信息
        const usersWithCount = users.map(user => ({
            ...user,
            item_count: itemCount[user.user_id] || 0
        }));

        renderUsersTable(usersWithCount, 'contentContainer');
        showMessage(`加载成功！共 ${users.length} 个用户`, 'success');
    } catch (error) {
        console.error('加载用户失败:', error);
        showMessage('加载失败: ' + error.message, 'error');
    }
}

/**
 * 渲染用户表格
 */
function renderUsersTable(users, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!users || users.length === 0) {
        showEmpty(containerId);
        return;
    }

    currentData = users;
    let html = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>用户ID</th>
                        <th>用户名</th>
                        <th>电话</th>
                        <th>发布商品数</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach(user => {
        html += `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.user_name}</td>
                <td>${user.phone || '-'}</td>
                <td><strong>${user.item_count || 0}</strong></td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== 订单相关函数 ====================

/**
 * 查询所有已售商品及其买家姓名
 */
async function querySoldItemsWithBuyer() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_id,
                item_id,
                buyer_id,
                order_date,
                item:item_id (item_name, price),
                buyer:buyer_id (user_name)
            `)
            .order('order_date', { ascending: false });

        if (error) throw error;

        // 转换数据结构
        const orders = data?.map(order => ({
            order_id: order.order_id,
            item_name: order.item?.[0]?.item_name || order.item_id,
            price: order.item?.[0]?.price || '-',
            buyer_name: order.buyer?.[0]?.user_name || order.buyer_id,
            order_date: order.order_date
        })) || [];

        renderOrdersTable(orders, 'contentContainer');
        showMessage(`查询成功！找到 ${orders.length} 笔已售订单`, 'success');
    } catch (error) {
        console.error('查询已售商品失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询每个订单：商品名+买家名+日期
 */
async function queryOrdersDetail() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_id,
                item_id,
                buyer_id,
                order_date,
                item:item_id (item_name, price, seller_id),
                buyer:buyer_id (user_name)
            `)
            .order('order_date', { ascending: false });

        if (error) throw error;

        // 获取卖家信息
        const sellerIds = [...new Set(data?.map(d => d.item?.[0]?.seller_id).filter(Boolean) || [])];
        let sellers = {};

        if (sellerIds.length > 0) {
            const { data: sellerData } = await supabase
                .from('user')
                .select('user_id, user_name')
                .in('user_id', sellerIds);
            
            sellers = Object.fromEntries(sellerData?.map(s => [s.user_id, s.user_name]) || []);
        }

        // 转换数据结构
        const orders = data?.map(order => ({
            order_id: order.order_id,
            item_name: order.item?.[0]?.item_name || order.item_id,
            price: order.item?.[0]?.price || '-',
            buyer_name: order.buyer?.[0]?.user_name || order.buyer_id,
            seller_name: sellers[order.item?.[0]?.seller_id] || order.item?.[0]?.seller_id || '-',
            order_date: order.order_date
        })) || [];

        renderOrdersTable(orders, 'contentContainer');
        showMessage(`查询成功！共 ${orders.length} 笔订单`, 'success');
    } catch (error) {
        console.error('查询订单详情失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 查询u001卖家的商品是否被购买
 */
async function queryU001SoldStatus() {
    showLoading('contentContainer');
    try {
        // 先获取u001发布的商品
        const { data: items, error: itemError } = await supabase
            .from('item')
            .select('item_id, item_name, price, status')
            .eq('seller_id', 'u001');

        if (itemError) throw itemError;

        if (!items || items.length === 0) {
            renderOrdersTable([], 'contentContainer');
            showMessage('u001未发布任何商品', 'info');
            return;
        }

        // 获取这些商品的订单信息
        const itemIds = items.map(i => i.item_id);
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select(`
                order_id,
                item_id,
                buyer_id,
                order_date,
                buyer:buyer_id (user_name)
            `)
            .in('item_id', itemIds);

        if (orderError) throw orderError;

        // 合并数据
        const itemMap = Object.fromEntries(items.map(i => [i.item_id, i]));
        const orderMap = {};
        orders?.forEach(order => {
            if (!orderMap[order.item_id]) {
                orderMap[order.item_id] = [];
            }
            orderMap[order.item_id].push(order);
        });

        // 构建结果
        const result = items.map(item => {
            const itemOrders = orderMap[item.item_id] || [];
            if (itemOrders.length > 0) {
                return itemOrders.map(order => ({
                    order_id: order.order_id,
                    item_name: item.item_name,
                    price: item.price,
                    buyer_name: order.buyer?.[0]?.user_name || order.buyer_id,
                    seller_name: 'u001',
                    order_date: order.order_date
                }));
            } else {
                return [{
                    order_id: '-',
                    item_name: item.item_name,
                    price: item.price,
                    buyer_name: '未售出',
                    seller_name: 'u001',
                    order_date: '-'
                }];
            }
        }).flat();

        renderOrdersTable(result, 'contentContainer');
        showMessage(`查询成功！u001发布了 ${items.length} 件商品，其中 ${orders?.length || 0} 件已售`, 'success');
    } catch (error) {
        console.error('查询u001售出情况失败:', error);
        showMessage('查询失败: ' + error.message, 'error');
    }
}

/**
 * 显示所有订单
 */
async function showAllOrders() {
    showLoading('contentContainer');
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_id,
                item_id,
                buyer_id,
                order_date,
                item:item_id (item_name, price, seller_id),
                buyer:buyer_id (user_name)
            `)
            .order('order_date', { ascending: false });

        if (error) throw error;

        // 获取卖家信息
        const sellerIds = [...new Set(data?.map(d => d.item?.[0]?.seller_id).filter(Boolean) || [])];
        let sellers = {};

        if (sellerIds.length > 0) {
            const { data: sellerData } = await supabase
                .from('user')
                .select('user_id, user_name')
                .in('user_id', sellerIds);
            
            sellers = Object.fromEntries(sellerData?.map(s => [s.user_id, s.user_name]) || []);
        }

        // 转换数据结构
        const orders = data?.map(order => ({
            order_id: order.order_id,
            item_name: order.item?.[0]?.item_name || order.item_id,
            price: order.item?.[0]?.price || '-',
            buyer_name: order.buyer?.[0]?.user_name || order.buyer_id,
            seller_name: sellers[order.item?.[0]?.seller_id] || order.item?.[0]?.seller_id || '-',
            order_date: order.order_date
        })) || [];

        renderOrdersTable(orders, 'contentContainer');
        
        // 计算统计信息
        if (orders.length > 0) {
            const totalAmount = orders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);
            const avgAmount = (totalAmount / orders.length).toFixed(2);
            
            renderOrderStats(orders.length, totalAmount.toFixed(2), avgAmount);
        }

        showMessage(`加载成功！共 ${orders.length} 笔订单`, 'success');
    } catch (error) {
        console.error('加载订单失败:', error);
        showMessage('加载失败: ' + error.message, 'error');
    }
}

/**
 * 渲染订单表格
 */
function renderOrdersTable(orders, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!orders || orders.length === 0) {
        showEmpty(containerId);
        return;
    }

    currentData = orders;
    let html = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>订单ID</th>
                        <th>商品名</th>
                        <th>买家名</th>
                        <th>卖家名</th>
                        <th>价格(元)</th>
                        <th>交易日期</th>
                    </tr>
                </thead>
                <tbody>
    `;

    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.item_name}</td>
                <td>${order.buyer_name}</td>
                <td>${order.seller_name}</td>
                <td>¥${order.price}</td>
                <td>${formatDate(order.order_date)}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * 渲染订单统计信息
 */
function renderOrderStats(count, totalAmount, avgAmount) {
    const statsHtml = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">订单总数</div>
                <div class="value">${count}</div>
            </div>
            <div class="stat-card">
                <div class="label">交易总额</div>
                <div class="value">¥${totalAmount}</div>
            </div>
            <div class="stat-card">
                <div class="label">平均订单额</div>
                <div class="value">¥${avgAmount}</div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('contentContainer');
    if (container) {
        container.insertAdjacentHTML('beforeend', statsHtml);
    }
}

// ==================== 业务功能 ====================

/**
 * 购买商品功能
 */
async function buyItem(itemId, itemName, price) {
    // 提示用户选择买家
    const buyerId = prompt('请输入你的用户ID (或使用默认 u002):', 'u002');
    
    if (buyerId === null) return; // 用户取消

    if (!buyerId.trim()) {
        showMessage('用户ID不能为空', 'error');
        return;
    }

    try {
        // 1. 检查商品状态
        const { data: item, error: checkError } = await supabase
            .from('item')
            .select('status')
            .eq('item_id', itemId)
            .single();

        if (checkError) throw checkError;

        if (item.status !== 0) {
            showMessage('该商品已售出，无法购买', 'error');
            return;
        }

        // 2. 插入订单
        const { error: insertError } = await supabase
            .from('orders')
            .insert([{
                item_id: itemId,
                buyer_id: buyerId,
                order_date: new Date().toISOString()
            }]);

        if (insertError) throw insertError;

        // 3. 更新商品状态为已售
        const { error: updateError } = await supabase
            .from('item')
            .update({ status: 1 })
            .eq('item_id', itemId);

        if (updateError) throw updateError;

        showMessage(`购买成功！已为 ${itemName} (¥${price}) 创建订单`, 'success');
        
        // 刷新当前数据
        showAllItems();
    } catch (error) {
        console.error('购买商品失败:', error);
        showMessage('购买失败: ' + error.message, 'error');
    }
}

/**
 * 渲染统计信息
 */
function renderStatInfo(htmlContent) {
    const container = document.getElementById('contentContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #f9f9f9; border-radius: 8px; font-size: 1.1em; color: #333;">
            ${htmlContent}
        </div>
    `;
}

// ==================== 首页统计 ====================

/**
 * 更新首页统计
 */
async function updateHomeStats() {
    try {
        // 获取商品总数
        const { count: totalCount } = await supabase
            .from('item')
            .select('*', { count: 'exact', head: true });

        // 获取未售商品数
        const { count: unsoldsCount } = await supabase
            .from('item')
            .select('*', { count: 'exact', head: true })
            .eq('status', 0);

        // 获取已售商品数
        const { count: soldCount } = await supabase
            .from('item')
            .select('*', { count: 'exact', head: true })
            .eq('status', 1);

        // 计算平均价格
        const { data: priceData } = await supabase
            .from('item')
            .select('price');

        let avgPrice = 0;
        if (priceData && priceData.length > 0) {
            const sum = priceData.reduce((acc, item) => acc + item.price, 0);
            avgPrice = (sum / priceData.length).toFixed(2);
        }

        // 更新DOM
        const homeStats = document.getElementById('homeStats');
        if (homeStats) {
            homeStats.innerHTML = `
                <div class="stat-card">
                    <div class="label">商品总数</div>
                    <div class="value">${totalCount || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="label">出售中</div>
                    <div class="value">${unsoldsCount || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="label">已售出</div>
                    <div class="value">${soldCount || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="label">平均价格</div>
                    <div class="value">¥${avgPrice || 0}</div>
                </div>
            `;
        }

    } catch (error) {
        console.error('更新首页统计失败:', error);
    }
}

// ==================== 页面导航 ====================

/**
 * 导航到指定页面
 */
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

console.log('应用已加载，Supabase连接成功');
