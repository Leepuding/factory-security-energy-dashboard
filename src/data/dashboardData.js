function createPanelDetails() {
  return {
  "安防事件闭环": securityDetail("安防事件闭环", "综合态势", [
    ["今日告警", "128", "起", "高危 23 起", "high"],
    ["未处置", "9", "起", "超时 3 起", "medium"],
    ["闭环率", "92.6", "%", "较昨日 +3.1%", "success"],
    ["视频联动", "116", "次", "成功率 98.6%", "success"],
  ], [
    ["AF-1024", "周界入侵告警", "北侧防区-围栏区域", "高危", "王磊", "处置中", "high"],
    ["AF-1018", "重点人员命中", "办公楼人脸闸机", "高危", "陈敏", "待复核", "high"],
    ["AF-1009", "越权进入告警", "研发楼二层机房门禁", "中危", "赵鹏", "已派单", "medium"],
    ["AF-0998", "车辆违停告警", "主通道-消防通道", "中危", "安保二组", "已闭环", "success"],
  ]),
  "通行与人员管控": accessDetail("通行与人员管控", "综合态势", [
    ["通行次数", "2,356", "次", "门禁异常 12 次", "medium"],
    ["访客违规", "8", "次", "超时滞留 5 人", "medium"],
    ["车辆违规", "15", "起", "消防通道 6 起", "high"],
    ["人脸命中", "7 / 2", "", "重点/黑名单", "high"],
  ]),
  "安防精细化态势图": securityDetail("安防精细化态势图", "综合态势", [
    ["告警热区", "5", "处", "北侧与车间优先", "high"],
    ["点位在线", "95.8", "%", "异常设备 24 个", "medium"],
    ["周界布防", "4 / 4", "", "今日入侵 6 起", "success"],
    ["门禁异常", "12", "次", "通行 2,356 次", "medium"],
  ], [
    ["MAP-01", "北侧周界告警", "北侧 3# 防区", "高危", "安保一组", "视频复核", "high"],
    ["MAP-02", "生产车间告警", "车间南通道", "高危", "安保二组", "现场确认", "high"],
    ["MAP-03", "仓储区门禁", "仓储区 C2", "中危", "值班岗", "权限复核", "medium"],
    ["MAP-04", "车辆违规", "东门通道", "中危", "门岗", "广播提醒", "medium"],
  ]),
  "能耗与新能源": energyDetail("能耗与新能源", "综合态势", [
    ["今日用电", "9,650", "kWh", "同比 +9.04%", "medium"],
    ["光伏发电", "2,186", "kWh", "自用 1,880 kWh", "success"],
    ["储能 SOC", "68", "%", "充/放 120/80 kW", "success"],
    ["峰值负荷", "1,265", "kW", "生产车间触发", "high"],
  ]),
  "能源预警": energyDetail("能源预警", "综合态势", [
    ["预警总数", "4", "起", "处理中 3 起", "medium"],
    ["高耗能预警", "1", "起", "生产车间 1#配电柜", "high"],
    ["异常波动", "1", "起", "研发楼中间回路", "medium"],
    ["已闭环", "1", "起", "办公照明回路", "success"],
  ]),
  "安防设备接入清单": deviceDetail("安防设备接入清单", "综合态势"),
  "安防颗粒度指标（今日）": securityDetail("安防颗粒度指标（今日）", "综合态势"),
  "实时告警处置": securityDetail("实时告警处置", "综合安防"),
  "处置工单队列": workOrderDetail("处置工单队列", "综合安防"),
  "安防管理一张图": securityDetail("安防管理一张图", "综合安防"),
  "防区与点位状态": securityDetail("防区与点位状态", "综合安防"),
  "设备健康与在线": deviceDetail("设备健康与在线", "综合安防"),
  "通行管控明细": accessDetail("通行管控明细", "综合安防"),
  "巡更与值守": dutyDetail("巡更与值守", "综合安防"),
  "告警趋势与类型": securityDetail("告警趋势与类型", "综合安防"),
  "产线运行状态": productionDetail("产线运行状态", "生产驾驶舱"),
  "生产工单进度": productionOrderDetail("生产工单进度", "生产驾驶舱"),
  "车间流水线可视化": productionDetail("车间流水线可视化", "生产驾驶舱"),
  "质量与返工": qualityDetail("质量与返工", "生产驾驶舱"),
  "瓶颈与物料约束": bottleneckDetail("瓶颈与物料约束", "生产驾驶舱"),
  "通行点位状态": accessDetail("通行点位状态", "智慧通行"),
  "实时通行流水": accessDetail("实时通行流水", "智慧通行"),
  "通行态势一张图": accessDetail("通行态势一张图", "智慧通行"),
  "通行趋势与点位排行": accessDetail("通行趋势与点位排行", "智慧通行"),
  "访客与车辆处置": accessDetail("访客与车辆处置", "智慧通行"),
  "能源分类总览": energyDetail("能源分类总览", "能源驾驶舱"),
  "高耗能设备排行": energyDetail("高耗能设备排行", "能源驾驶舱"),
  "能源态势与分析": energyDetail("能源态势与分析", "能源驾驶舱"),
  "分区负荷与光储状态": energyDetail("分区负荷与光储状态", "能源驾驶舱"),
  "能源预警与优化建议": energyDetail("能源预警与优化建议", "能源驾驶舱"),
  "设备分类在线": deviceDetail("设备分类在线", "设备总览"),
  "运维工单": workOrderDetail("运维工单", "设备总览"),
  "设备总览一张图": deviceDetail("设备总览一张图", "设备总览"),
  "平台基础能力": platformDetail("平台基础能力", "设备总览"),
  "生命周期提醒": lifecycleDetail("生命周期提醒", "设备总览"),
  "联动事件队列": commandDetail("联动事件队列", "联动指挥"),
  "指挥处置流程": commandDetail("指挥处置流程", "联动指挥"),
  "指挥调度一张图": commandDetail("指挥调度一张图", "联动指挥"),
  "队伍在线与派遣": commandDetail("队伍在线与派遣", "联动指挥"),
  "联动趋势与类型": commandDetail("联动趋势与类型", "联动指挥"),
  };
}

function makeDetail(title, page, metrics, columns, rows, related, insights) {
  return {
    title,
    page,
    layout: inferDetailLayout(title, page),
    metrics: metrics.map(([label, value, unit = "", sub = "", tone = "success"]) => ({ label, value, unit, sub, tone })),
    columns,
    rows,
    related,
    insights,
  };
}

function inferDetailLayout(title, page) {
  if (page === "能源驾驶舱" || title.includes("能耗") || title.includes("能源") || title.includes("光储")) return "energy-layout";
  if (page === "生产驾驶舱" || title.includes("产线") || title.includes("生产") || title.includes("质量") || title.includes("瓶颈")) return "production-layout";
  if (page === "智慧通行" || title.includes("通行") || title.includes("访客") || title.includes("车辆")) return "access-layout";
  if (page === "设备总览" || title.includes("设备") || title.includes("平台") || title.includes("生命周期") || title.includes("运维")) return "device-layout";
  if (page === "联动指挥" || title.includes("指挥") || title.includes("联动") || title.includes("队伍")) return "command-layout";
  return "security-layout";
}

const securityColumns = [
  { key: "id", label: "事件编号" },
  { key: "name", label: "事件类型" },
  { key: "target", label: "点位/防区" },
  { key: "level", label: "等级", toneKey: "tone" },
  { key: "owner", label: "处置人" },
  { key: "status", label: "状态" },
];

function securityDetail(title, page, metrics = [
  ["事件总数", "42", "起", "高危 7 起", "high"],
  ["视频联动", "38", "次", "失败 1 次", "success"],
  ["平均响应", "3.2", "分", "目标 5 分钟", "success"],
  ["未闭环", "9", "起", "超时 3 起", "medium"],
], rows = [
  ["SEC-2401", "北侧周界入侵", "北侧 3# 防区", "高危", "安保一组", "复核中", "high"],
  ["SEC-2402", "消防通道违停", "生产车间南通道", "中危", "门岗", "已派单", "medium"],
  ["SEC-2403", "研发楼机房越权", "研发楼二层", "高危", "陈敏", "权限复核", "high"],
  ["SEC-2404", "仓储摄像机离线", "仓储区 C2", "一般", "弱电组", "处理中", "medium"],
]) {
  return makeDetail(title, page, metrics, securityColumns, rows.map(toSecurityRow), [
    { name: "北侧防区", value: "高危 2 起", tone: "high" },
    { name: "生产车间", value: "处置中 3 起", tone: "medium" },
    { name: "办公访客区", value: "关注 4 起", tone: "success" },
  ], ["优先复核北侧周界与研发楼机房的高危事件。", "视频联动成功率稳定，可继续作为告警确认主链路。", "超时事件集中在现场反馈环节，建议压缩工单回填时长。"]);
}

function toSecurityRow([id, name, target, level, owner, status, tone]) {
  return { id, name, target, level, owner, status, tone };
}

const accessColumns = [
  { key: "time", label: "时间" },
  { key: "target", label: "人员/车辆" },
  { key: "gate", label: "通行点" },
  { key: "method", label: "核验方式" },
  { key: "result", label: "结果", toneKey: "tone" },
  { key: "action", label: "联动动作" },
];

function accessDetail(title, page, metrics = [
  ["今日通行", "3,742", "次", "员工 2,186 / 车辆 1,418", "success"],
  ["异常拦截", "27", "起", "高危 5 起", "high"],
  ["平均核验", "1.6", "秒", "高峰 2.9 秒", "success"],
  ["设备在线", "98.2", "%", "离线 2 台", "success"],
]) {
  return makeDetail(title, page, metrics, accessColumns, [
    { time: "16:05:18", target: "员工 0526", gate: "办公楼东闸机", method: "人脸核验", result: "放行", action: "记录通行", tone: "success" },
    { time: "16:03:44", target: "外协 A-173", gate: "研发楼机房", method: "访客码+权限", result: "拒绝", action: "通知安保", tone: "high" },
    { time: "15:51:11", target: "访客 V-2108", gate: "访客中心", method: "预约码", result: "超时", action: "短信提醒", tone: "medium" },
    { time: "15:43:02", target: "运输车辆 T-31", gate: "北门岗亭", method: "车牌+预约", result: "拦截", action: "人工复核", tone: "high" },
  ], [
    { name: "研发楼机房", value: "拒绝 4 次", tone: "high" },
    { name: "访客中心", value: "超时 6 人", tone: "medium" },
    { name: "南门道闸", value: "排队 4 车", tone: "success" },
  ], ["研发楼机房拒绝记录集中在外协人员，建议复核临时权限有效期。", "访客超时与预约离园确认相关，可增加自动提醒频次。", "车辆通行高峰稳定在南门，北门货运预约需人工复核。"]);
}

const energyColumns = [
  { key: "target", label: "对象/回路" },
  { key: "current", label: "当前值" },
  { key: "limit", label: "阈值/基准" },
  { key: "source", label: "关联能源" },
  { key: "status", label: "状态", toneKey: "tone" },
  { key: "action", label: "优化建议" },
];

function energyDetail(title, page, metrics = [
  ["今日用电", "9,650", "kWh", "同比 +9.04%", "medium"],
  ["光伏贡献", "2,186", "kWh", "自用率 86%", "success"],
  ["储能 SOC", "68", "%", "晚高峰放电中", "success"],
  ["异常耗能", "4", "起", "处理中 3 起", "high"],
]) {
  return makeDetail(title, page, metrics, energyColumns, [
    { target: "生产车间 1#配电柜", current: "1,256 kW", limit: ">1,100 kW", source: "市电+储能", status: "越限", action: "错峰启动空压机", tone: "high" },
    { target: "研发楼中间回路", current: "392 kW", limit: ">320 kW", source: "市电", status: "波动", action: "复核空调策略", tone: "medium" },
    { target: "办公楼照明回路", current: "78 kW", limit: ">50 kW", source: "市电", status: "已闭环", action: "分区定时", tone: "success" },
    { target: "储能 PCS 柜", current: "68% SOC", limit: "60%-90%", source: "储能", status: "正常", action: "保持晚高峰放电", tone: "success" },
  ], [
    { name: "生产动力", value: "5,284 kWh", tone: "medium" },
    { name: "光伏自用", value: "1,880 kWh", tone: "success" },
    { name: "储能放电", value: "640 kWh", tone: "success" },
  ], ["生产车间负荷仍是峰值来源，优先联动空压机错峰。", "光伏自用占比较高，午间可继续抬高储能充电功率。", "办公照明非工作用能已闭环，可沉淀为默认节能策略。"]);
}

function deviceDetail(title, page) {
  return makeDetail(title, page, [
    ["接入设备", "3,256", "台", "在线 3,126 台", "success"],
    ["异常设备", "24", "台", "高危 5 台", "medium"],
    ["离线设备", "130", "台", "超过 24h：18 台", "high"],
    ["工单闭环", "86.4", "%", "今日新增 7 单", "medium"],
  ], [
    { key: "type", label: "设备类型" },
    { key: "online", label: "在线/总数" },
    { key: "fault", label: "异常点位" },
    { key: "owner", label: "责任组" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "ticket", label: "关联工单" },
  ], [
    { type: "视频监控", online: "1,532/1,599", fault: "仓储区 C2", owner: "弱电组", status: "关注", ticket: "YW-2408", tone: "medium" },
    { type: "门禁通行", online: "103/111", fault: "研发楼机房", owner: "通行组", status: "处理中", ticket: "YW-2407", tone: "medium" },
    { type: "能源采集", online: "286/291", fault: "2# 电表", owner: "能源组", status: "已派单", ticket: "YW-2406", tone: "high" },
    { type: "周界系统", online: "4/4", fault: "无", owner: "安保组", status: "正常", ticket: "-", tone: "success" },
  ], [
    { name: "视频监控", value: "故障 15 路", tone: "medium" },
    { name: "门禁设备", value: "离线 3 台", tone: "medium" },
    { name: "周界主机", value: "4/4 在线", tone: "success" },
  ], ["离线超过 24 小时的设备应优先纳入巡检路线。", "能源采集网关故障会影响能耗预警准确性，建议优先恢复。", "周界主机状态稳定，可作为高危告警联动基础。"]);
}

function workOrderDetail(title, page) {
  return makeDetail(title, page, [
    ["工单总数", "18", "单", "今日新增 7 单", "medium"],
    ["处理中", "9", "单", "高危 2 单", "high"],
    ["平均 SLA", "14.6", "分", "目标 30 分钟", "success"],
    ["闭环率", "86.4", "%", "未反馈 3 单", "medium"],
  ], [
    { key: "id", label: "工单" },
    { key: "event", label: "事件" },
    { key: "owner", label: "负责人" },
    { key: "sla", label: "剩余时限" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "action", label: "下一步" },
  ], [
    { id: "GD-1526", event: "周界入侵复核", owner: "王磊", sla: "04:18", status: "处理中", action: "现场反馈", tone: "medium" },
    { id: "GD-1525", event: "尾随通行核验", owner: "陈敏", sla: "02:42", status: "待反馈", action: "补充视频", tone: "high" },
    { id: "YW-2408", event: "仓储区摄像机离线", owner: "弱电组", sla: "18:20", status: "处理中", action: "更换电源", tone: "medium" },
    { id: "YW-2406", event: "2#电表数据中断", owner: "能源组", sla: "12:45", status: "已派单", action: "网关重启", tone: "medium" },
  ], [
    { name: "安保组", value: "7 单", tone: "medium" },
    { name: "弱电组", value: "5 单", tone: "success" },
    { name: "能源组", value: "3 单", tone: "medium" },
  ], ["尾随通行核验接近 SLA，建议置顶催办。", "设备类工单集中在弱电和能源采集，适合合并巡检。", "闭环短板主要在现场照片和结果反馈。"]);
}

function productionDetail(title, page) {
  return makeDetail(title, page, [
    ["今日计划", "1,280", "件", "三条产线", "success"],
    ["已完成", "846", "件", "完成率 66.1%", "success"],
    ["在制品", "312", "件", "装配段 126 件", "medium"],
    ["设备稼动", "88.6", "%", "停机 2 台", "medium"],
  ], [
    { key: "line", label: "产线/工位" },
    { key: "plan", label: "计划" },
    { key: "done", label: "完成" },
    { key: "beat", label: "节拍" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "risk", label: "风险" },
  ], [
    { line: "A线 注塑成型", plan: "456 件", done: "328 件", beat: "42 秒", status: "正常", risk: "模具保养后 6h", tone: "success" },
    { line: "B线 精密装配", plan: "448 件", done: "286 件", beat: "58 秒", status: "关注", risk: "装配节拍偏慢", tone: "medium" },
    { line: "C线 测试包装", plan: "376 件", done: "232 件", beat: "51 秒", status: "排队", risk: "功能测试排队 46 件", tone: "medium" },
    { line: "返工工位", plan: "18 件", done: "7 件", beat: "-", status: "返工", risk: "外观划伤 9 件", tone: "high" },
  ], [
    { name: "B线装配", value: "瓶颈 58 秒", tone: "medium" },
    { name: "功能测试台", value: "排队 46 件", tone: "high" },
    { name: "主料齐套", value: "98%", tone: "success" },
  ], ["生产瓶颈集中在 B 线装配和功能测试台。", "返工件主要来自外观划伤，建议检查转运周转器具。", "物料齐套率较高，短板不在主料供给。"]);
}

function productionOrderDetail(title, page) {
  const detail = productionDetail(title, page);
  detail.columns = [
    { key: "id", label: "工单" },
    { key: "batch", label: "批次" },
    { key: "line", label: "产线" },
    { key: "plan", label: "计划完成" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "risk", label: "延期风险" },
  ];
  detail.rows = [
    { id: "MO-0523-01", batch: "阀体组件 A 批次", line: "A线", plan: "18:30", status: "生产中", risk: "低", tone: "success" },
    { id: "MO-0523-02", batch: "传感器壳体 B 批次", line: "B线", plan: "20:00", status: "换型中", risk: "中", tone: "medium" },
    { id: "MO-0523-03", batch: "控制盒 C 批次", line: "C线", plan: "21:30", status: "测试中", risk: "中", tone: "medium" },
    { id: "MO-0523-04", batch: "小批试制 D 批次", line: "试制线", plan: "明日 10:00", status: "待上线", risk: "低", tone: "success" },
  ];
  return detail;
}

function qualityDetail(title, page) {
  const detail = productionDetail(title, page);
  detail.metrics = [
    { label: "一次合格率", value: "97.8", unit: "%", sub: "较昨日 +0.6%", tone: "success" },
    { label: "返工件", value: "18", unit: "件", sub: "外观 9 / 尺寸 6", tone: "high" },
    { label: "复检中", value: "6", unit: "件", sub: "尺寸偏差", tone: "medium" },
    { label: "留样批次", value: "12", unit: "件", sub: "A线 0523-A06", tone: "success" },
  ];
  detail.rows = [
    { line: "尺寸偏差", plan: "6 件", done: "2 件", beat: "卡尺抽检", status: "复检", risk: "注塑温控", tone: "medium" },
    { line: "外观划伤", plan: "9 件", done: "3 件", beat: "目检", status: "返工", risk: "转运刮擦", tone: "high" },
    { line: "功能不良", plan: "3 件", done: "1 件", beat: "电测", status: "分析", risk: "测试台 2#", tone: "medium" },
    { line: "批次留样", plan: "12 件", done: "12 件", beat: "留样", status: "已留样", risk: "无", tone: "success" },
  ];
  return detail;
}

function bottleneckDetail(title, page) {
  const detail = productionDetail(title, page);
  detail.metrics = [
    { label: "瓶颈工位", value: "5", unit: "处", sub: "高风险 2 处", tone: "high" },
    { label: "测试排队", value: "46", unit: "件", sub: "功能测试台", tone: "high" },
    { label: "缺料项", value: "3", unit: "项", sub: "物料 K-17 余量 3.5h", tone: "medium" },
    { label: "工装可用", value: "21", unit: "套", sub: "满足当前班次", tone: "success" },
  ];
  return detail;
}

function dutyDetail(title, page) {
  return makeDetail(title, page, [
    ["在线岗亭", "8/8", "", "值守正常", "success"],
    ["巡更路线", "12", "条", "执行中 4 条", "success"],
    ["漏巡点位", "3", "个", "已派单复核", "medium"],
    ["应急广播", "2", "次", "联动测试通过", "success"],
  ], securityColumns, [
    ["RG-1201", "北侧巡更漏点", "北侧围栏", "中危", "安保一组", "补巡中", "medium"],
    ["RG-1202", "仓储夜间巡检", "危化仓", "一般", "安保二组", "正常", "success"],
    ["RG-1203", "岗亭交接班", "东门岗亭", "一般", "值班长", "已完成", "success"],
    ["RG-1204", "广播联动测试", "生产车间", "一般", "指挥中心", "通过", "success"],
  ].map(toSecurityRow), [
    { name: "北侧路线", value: "漏巡 2 点", tone: "medium" },
    { name: "仓储路线", value: "到位率 100%", tone: "success" },
    { name: "岗亭值守", value: "8/8 在线", tone: "success" },
  ], ["漏巡集中在北侧路线，建议与周界告警一并复核。", "岗亭值守正常，可支撑高危事件快速派遣。", "广播联动测试通过，可用于车辆违停提醒。"]);
}

function platformDetail(title, page) {
  return makeDetail(title, page, [
    ["数据量", "86.4", "万条", "今日新增", "success"],
    ["设备接入", "3,256", "台", "在线率 96.2%", "success"],
    ["告警中心", "128", "起", "闭环率 92.6%", "medium"],
    ["消息成功", "98.6", "%", "电话拨通 92.3%", "success"],
  ], [
    { key: "name", label: "基础能力" },
    { key: "scope", label: "覆盖范围" },
    { key: "value", label: "今日数据" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "action", label: "关注点" },
  ], [
    { name: "数据中台", scope: "事件/设备/能耗", value: "86.4万条", status: "正常", action: "保持增量同步", tone: "success" },
    { name: "物联中台", scope: "视频/门禁/能源", value: "3,256台", status: "关注", action: "离线设备补偿", tone: "medium" },
    { name: "消息中心", scope: "短信/电话/站内", value: "98.6%", status: "正常", action: "失败重试", tone: "success" },
    { name: "权限中心", scope: "256用户/48角色", value: "12次变更", status: "正常", action: "敏感权限复核", tone: "success" },
  ], [
    { name: "物联中台", value: "设备底座", tone: "success" },
    { name: "告警中心", value: "闭环主链路", tone: "medium" },
    { name: "消息中心", value: "联动通知", tone: "success" },
  ], ["设备离线会影响告警与能耗两类业务，建议纳入统一健康评分。", "消息中心成功率高，可承担高危事件催办。", "权限中心需定期复核机房和危化仓访问策略。"]);
}

function lifecycleDetail(title, page) {
  const detail = deviceDetail(title, page);
  detail.metrics = [
    { label: "质保内", value: "2,486", unit: "台", sub: "运行正常", tone: "success" },
    { label: "90天到期", value: "214", unit: "台", sub: "录像机/闸机控制器", tone: "medium" },
    { label: "待升级", value: "37", unit: "台", sub: "AI盒/门禁控制器", tone: "medium" },
    { label: "备件不足", value: "6", unit: "类", sub: "道闸雷达/门锁电池", tone: "high" },
  ];
  detail.rows = [
    { type: "质保内", online: "2,486 台", fault: "摄像机 / 门禁 / 能源表", owner: "运维组", status: "正常", ticket: "-", tone: "success" },
    { type: "质保到期 90 天", online: "214 台", fault: "录像机 / 闸机控制器", owner: "采购组", status: "提醒", ticket: "LC-090", tone: "medium" },
    { type: "固件待升级", online: "37 台", fault: "AI盒 / 门禁控制器", owner: "弱电组", status: "排期", ticket: "LC-037", tone: "medium" },
    { type: "备件不足", online: "6 类", fault: "道闸雷达 / 门锁电池", owner: "仓储组", status: "补货", ticket: "LC-006", tone: "high" },
  ];
  return detail;
}

function commandDetail(title, page) {
  return makeDetail(title, page, [
    ["联动事件", "42", "起", "自动联动 31 起", "medium"],
    ["高危指挥", "7", "起", "视频复核中 2 起", "high"],
    ["平均响应", "3.2", "分", "目标 5 分钟", "success"],
    ["在线队伍", "8", "组", "已出动 2 组", "success"],
  ], [
    { key: "time", label: "时间" },
    { key: "event", label: "事件链路" },
    { key: "resource", label: "调度资源" },
    { key: "verify", label: "复核方式" },
    { key: "status", label: "状态", toneKey: "tone" },
    { key: "duration", label: "响应时长" },
  ], [
    { time: "16:08", event: "北侧周界入侵联动", resource: "安保一组", verify: "热成像+视频", status: "复核中", duration: "3.1 分", tone: "high" },
    { time: "16:10", event: "消防通道车辆停留", resource: "门岗+广播", verify: "车牌+视频", status: "已派单", duration: "4.6 分", tone: "medium" },
    { time: "16:14", event: "研发楼机房越权", resource: "权限管理员", verify: "门禁+人脸", status: "拦截", duration: "2.4 分", tone: "high" },
    { time: "16:18", event: "储能负荷波动", resource: "能源运维", verify: "电表+网关", status: "处理中", duration: "5.2 分", tone: "medium" },
  ], [
    { name: "安保一组", value: "出动 2 次", tone: "medium" },
    { name: "视频坐席", value: "调阅 42 路", tone: "success" },
    { name: "应急广播", value: "12 次", tone: "success" },
  ], ["高危事件仍以视频复核为核心链路，应保持坐席在线。", "消防通道事件适合广播先行、工单跟进。", "能源类联动响应略慢，建议把运维到场状态接入指挥视图。"]);
}

export const dashboardData = {
  panelDetails: createPanelDetails(),
  nav: ["综合态势", "综合安防", "生产驾驶舱", "智慧通行", "能源驾驶舱", "设备总览", "联动指挥"],
  parkStats: [
    { label: "总人数", value: "5,481", unit: "人", icon: "visitor", tone: "success" },
    { label: "剩余车位", value: "361", unit: "个", icon: "car", tone: "normal" },
    { label: "紧急告警", value: "3", unit: "个", icon: "alarm", tone: "danger" },
    { label: "异常设备", value: "24", unit: "个", icon: "server", tone: "warn" },
  ],
  moduleMenus: [
    { name: "综合安防", desc: "Comprehensive security", icon: "perimeter", tone: "danger" },
    { name: "生产驾驶舱", desc: "Production cockpit", icon: "process", tone: "normal" },
    { name: "智慧通行", desc: "Smart pass", icon: "turnstile", tone: "success" },
    { name: "能源驾驶舱", desc: "Energy cockpit", icon: "energy", tone: "normal" },
    { name: "联动指挥", desc: "Linkage command", icon: "process", tone: "warn" },
  ],
  securitySummary: [
    { label: "今日告警总数", value: "128", tone: "danger", icon: "alarm" },
    { label: "高危告警数", value: "23", tone: "danger", icon: "alarm" },
    { label: "未处置数", value: "9", tone: "warn", icon: "process" },
    { label: "闭环率", value: "92.6", unit: "%", tone: "success", icon: "process" },
  ],
  alarms: [
    { time: "10:24:18", title: "周界入侵告警", place: "北侧防区-围栏区域", tone: "high", icon: "alarm" },
    { time: "10:12:08", title: "重点人员命中", place: "办公楼人脸闸机", tone: "high", icon: "face" },
    { time: "09:58:41", title: "越权进入告警", place: "研发楼二层机房门禁", tone: "medium", icon: "access" },
    { time: "09:42:17", title: "车辆违停告警", place: "主通道-消防通道", tone: "medium", icon: "car" },
    { time: "09:31:05", title: "访客超时滞留", place: "园区东门岗", tone: "low", icon: "visitor" },
  ],
  process: ["告警产生", "视频联动", "抓拍取证", "通知派单", "处置反馈", "闭环归档"],
  mapKpis: [
    { label: "视频监控", metricLabel: "在线率", value: "95.8", unit: "%", sub: "故障数 15", tone: "normal", icon: "camera" },
    { label: "周界防区", metricLabel: "布防", value: "4 / 4", unit: "", sub: "入侵告警 6", tone: "success", icon: "perimeter" },
    { label: "门禁管理", metricLabel: "异常次数", value: "12", unit: "", sub: "通行次数 2,356", tone: "warn", icon: "access" },
    { label: "人闸道闸", metricLabel: "异常数", value: "5", unit: "", sub: "通行次数 1,852", tone: "warn", icon: "turnstile" },
    { label: "警戒球机", metricLabel: "在线", value: "32", unit: "", sub: "今日告警 11", tone: "danger", icon: "sphere" },
  ],
  access: [
    { name: "门禁异常", value: "12", desc: "异常次数", total: "今日通行 2,356", tone: "high", icon: "access" },
    { name: "访客违规", value: "8", desc: "违规次数", total: "今日访客 156", tone: "medium", icon: "visitor" },
    { name: "车辆违规", value: "15", desc: "违停/禁入", total: "今日进出 1,268", tone: "medium", icon: "car" },
    { name: "人脸命中", value: "7 / 2", desc: "重点/黑名单", total: "今日抓拍 126", tone: "high", icon: "face" },
    { name: "人闸异常", value: "5", desc: "异常次数", total: "今日通行 1,852", tone: "medium", icon: "turnstile" },
    { name: "智能门锁异常", value: "3", desc: "异常次数", total: "门锁总数 128", tone: "low", icon: "lock" },
  ],
  mapPoints: [
    { x: 17, y: 22, label: "摄像头", type: "camera", tone: "normal", icon: "camera" },
    { x: 30, y: 17, label: "北侧周界告警", type: "alarm", tone: "high", icon: "alarm" },
    { x: 48, y: 24, label: "警戒球机", type: "sphere", tone: "normal", icon: "sphere" },
    { x: 63, y: 19, label: "门禁点位", type: "access", tone: "normal", icon: "access" },
    { x: 77, y: 27, label: "告警点", type: "alarm", tone: "high", icon: "alarm" },
    { x: 22, y: 48, label: "西门岗亭", type: "gate", tone: "medium", icon: "guard" },
    { x: 44, y: 51, label: "生产车间告警", type: "alarm", tone: "high", icon: "alarm" },
    { x: 67, y: 48, label: "人闸/道闸", type: "turnstile", tone: "normal", icon: "turnstile" },
    { x: 85, y: 59, label: "东门岗亭", type: "gate", tone: "medium", icon: "guard" },
    { x: 16, y: 77, label: "南门道闸", type: "barrier", tone: "normal", icon: "barrier" },
    { x: 53, y: 79, label: "仓储区门禁", type: "access", tone: "normal", icon: "access" },
    { x: 78, y: 74, label: "车辆违规", type: "car", tone: "medium", icon: "car" },
  ],
  mapLegend: [
    { label: "摄像头", icon: "camera" },
    { label: "警戒球机", icon: "sphere" },
    { label: "门禁", icon: "access" },
    { label: "人闸", icon: "turnstile" },
    { label: "道闸", icon: "barrier" },
    { label: "周界防区", icon: "perimeter" },
    { label: "岗亭", icon: "guard" },
    { label: "告警点", icon: "alarm" },
  ],
  energyGauges: [
    { title: "今日用电", value: 9650, max: 10000, unit: "kWh", tone: "cyan" },
    { title: "昨日用电", value: 8850, max: 10000, unit: "kWh", tone: "green" },
    { title: "同比", value: 9.04, max: 20, unit: "%", tone: "orange" },
    { title: "环比", value: 4.52, max: 20, unit: "%", tone: "red" },
  ],
  energyResources: [
    { name: "用电", day: "9,650", dayLabel: "今日用电 kWh", month: "212,400", monthLabel: "本月用电 kWh", icon: "energy", tone: "cyan" },
    { name: "光伏", day: "2,186", dayLabel: "今日发电 kWh", month: "46,820", monthLabel: "本月发电 kWh", icon: "solar", tone: "success" },
    { name: "储能", day: "68%", dayLabel: "当前 SOC", month: "120/80", monthLabel: "充/放功率 kW", icon: "battery", tone: "success" },
  ],
  energyLine: {
    labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
    today: [420, 520, 760, 1180, 1265, 1110, 1430, 1280, 952],
    yesterday: [360, 430, 520, 860, 980, 1260, 1510, 1320, 1010],
  },
  energyCards: [
    { label: "峰值负荷", value: "1,265", unit: "kW", icon: "energy" },
    { label: "当前负荷", value: "952", unit: "kW", tone: "success", icon: "energy" },
  ],
  pvStorage: [
    { label: "光伏发电量", value: "2,186", unit: "kWh", icon: "solar" },
    { label: "储能 SOC", value: "68", unit: "%", tone: "success", icon: "battery" },
    { label: "充电功率", value: "120", unit: "kW", tone: "success", icon: "energy" },
    { label: "放电功率", value: "80", unit: "kW", tone: "success", icon: "energy" },
  ],
  remoteControls: [
    { label: "远程跳闸", value: "6", tone: "warn" },
    { label: "远程通电", value: "12", tone: "success" },
    { label: "远程断电", value: "8", tone: "danger" },
  ],
  energyWarnings: [
    { type: "高耗能预警", target: "生产车间-1#配电柜", current: "1,256 kW", limit: ">1,100", level: "high", status: "处理中" },
    { type: "异常波动", target: "研发楼-中间回路", current: "392 kW", limit: ">320", level: "medium", status: "待处理" },
    { type: "非工作时段用能", target: "办公楼-照明回路", current: "78 kW", limit: ">50", level: "low", status: "已闭环" },
    { type: "排烟启停", target: "仓储区-冷库设备", current: "215 kW", limit: ">200", level: "medium", status: "处理中" },
  ],
  deviceAssets: [
    { name: "摄像头", online: "1,532", offline: "67", icon: "camera" },
    { name: "警戒球机", online: "30", offline: "2", icon: "sphere" },
    { name: "门禁", online: "65", offline: "3", icon: "access" },
    { name: "人闸", online: "22", offline: "1", icon: "turnstile" },
    { name: "道闸", online: "16", offline: "2", icon: "barrier" },
    { name: "周界防区", online: "4", offline: "0", icon: "perimeter" },
    { name: "智能门锁", online: "125", offline: "3", icon: "lock" },
    { name: "录像机", online: "34", offline: "2", icon: "server" },
    { name: "监视工作站", online: "16", offline: "0", icon: "screen" },
    { name: "岗亭", online: "8", offline: "0", icon: "guard" },
  ],
  granularity: [
    { name: "视频监控", main: "在线率 95.8%", sub: "故障数 15", icon: "camera" },
    { name: "周界防区", main: "入侵告警 6", sub: "布防率 100%", icon: "perimeter" },
    { name: "门禁管理", main: "异常次数 12", sub: "通行次数 2,356", icon: "access" },
    { name: "访客管理", main: "违规次数 8", sub: "访客总数 156", icon: "visitor" },
    { name: "车辆管理", main: "违规次数 15", sub: "进出车辆 1,268", icon: "car" },
    { name: "人脸识别", main: "命中次数 9", sub: "抓拍记录 126", icon: "face" },
    { name: "巡更系统", main: "到位率 92.6%", sub: "漏巡次数 3", icon: "route" },
    { name: "岗亭值守", main: "事件上报 7", sub: "值守岗亭 8", icon: "guard" },
    { name: "事件处置", main: "处理中 18", sub: "闭环率 92.6%", icon: "process" },
    { name: "消息联动", main: "短信成功率 98.6%", sub: "拨通率 92.3%", icon: "message" },
  ],
  securityOverview: {
    trend: {
      labels: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00"],
      alarms: [18, 26, 41, 32, 29, 22],
      closed: [12, 18, 34, 28, 26, 20],
    },
    categories: [
      { name: "周界入侵", value: 36, color: "#ff5364" },
      { name: "门禁异常", value: 24, color: "#ff9f32" },
      { name: "车辆违规", value: 18, color: "#ffd166" },
      { name: "访客违规", value: 14, color: "#2fd2ff" },
      { name: "设备离线", value: 9, color: "#38f2a5" },
    ],
  },
  securityManagement: {
    kpis: [
      { label: "待处置事件", value: "18", tone: "warn", icon: "process", sub: "超时 3 起" },
      { label: "高危联动", value: "7", tone: "danger", icon: "alarm", sub: "视频复核 5 起" },
      { label: "视频在线率", value: "96.4", unit: "%", tone: "success", icon: "camera", sub: "离线 58 路" },
      { label: "门禁通行", value: "2,356", tone: "success", icon: "access", sub: "异常 12 次" },
      { label: "周界布防率", value: "100", unit: "%", tone: "success", icon: "perimeter", sub: "4 个防区在线" },
      { label: "巡更到位率", value: "92.6", unit: "%", tone: "warn", icon: "route", sub: "漏巡 3 次" },
    ],
    alarmFilters: ["全部", "高危", "门禁", "周界", "车辆", "设备"],
    realtimeAlarms: [
      { time: "15:12:26", title: "危化仓周界触发", place: "北侧 3# 防区", tone: "high", icon: "perimeter" },
      { time: "15:06:48", title: "消防通道车辆停留", place: "生产车间南通道", tone: "medium", icon: "car" },
      { time: "14:58:19", title: "陌生人尾随通行", place: "办公楼一层闸机", tone: "high", icon: "face" },
      { time: "14:44:37", title: "设备箱门异常开启", place: "东门岗亭弱电箱", tone: "medium", icon: "lock" },
      { time: "14:31:10", title: "摄像机离线", place: "仓储区 C2 通道", tone: "low", icon: "camera" },
      { time: "14:18:05", title: "访客超时未离场", place: "综合楼访客中心", tone: "low", icon: "visitor" },
    ],
    workOrders: [
      { id: "GD-1526", event: "周界入侵复核", owner: "王磊", sla: "04:18", status: "处理中", tone: "medium" },
      { id: "GD-1525", event: "尾随通行核验", owner: "陈敏", sla: "02:42", status: "待反馈", tone: "high" },
      { id: "GD-1524", event: "消防通道违停", owner: "赵鹏", sla: "09:35", status: "已派单", tone: "low" },
      { id: "GD-1523", event: "摄像机离线", owner: "运维组", sla: "22:10", status: "待处理", tone: "medium" },
    ],
    mapKpis: [
      { label: "告警热区", metricLabel: "今日", value: "5", unit: "处", sub: "北侧 / 车间优先", tone: "danger", icon: "alarm" },
      { label: "视频联动", metricLabel: "成功率", value: "98.6", unit: "%", sub: "失败 2 次", tone: "success", icon: "camera" },
      { label: "门禁布控", metricLabel: "名单", value: "42", unit: "人", sub: "命中 2 次", tone: "warn", icon: "access" },
      { label: "车辆管控", metricLabel: "异常", value: "15", unit: "起", sub: "违停 9 / 禁入 6", tone: "warn", icon: "car" },
      { label: "应急值守", metricLabel: "在线", value: "8", unit: "岗", sub: "响应均时 3.2 分", tone: "success", icon: "guard" },
    ],
    mapPoints: [
      { x: 18, y: 22, label: "北侧周界", type: "alarm", tone: "high", icon: "perimeter" },
      { x: 31, y: 18, label: "视频联动", type: "camera", tone: "normal", icon: "camera" },
      { x: 46, y: 23, label: "车间门禁", type: "access", tone: "medium", icon: "access" },
      { x: 64, y: 20, label: "办公楼闸机", type: "turnstile", tone: "high", icon: "turnstile" },
      { x: 79, y: 30, label: "访客中心", type: "visitor", tone: "medium", icon: "visitor" },
      { x: 25, y: 52, label: "西门岗亭", type: "guard", tone: "normal", icon: "guard" },
      { x: 43, y: 50, label: "生产车间", type: "alarm", tone: "high", icon: "alarm" },
      { x: 63, y: 51, label: "消防通道", type: "car", tone: "medium", icon: "car" },
      { x: 84, y: 58, label: "东门道闸", type: "barrier", tone: "normal", icon: "barrier" },
      { x: 17, y: 78, label: "南门车辆", type: "car", tone: "normal", icon: "car" },
      { x: 53, y: 79, label: "仓储门锁", type: "lock", tone: "medium", icon: "lock" },
      { x: 78, y: 75, label: "巡更漏点", type: "route", tone: "medium", icon: "route" },
    ],
    zones: [
      { name: "北侧周界防区", scope: "电子围栏 / 热成像", online: "24/24", status: "告警", tone: "high" },
      { name: "生产车间防区", scope: "视频 AI / 门禁", online: "186/192", status: "处置中", tone: "medium" },
      { name: "危化仓储防区", scope: "门锁 / 视频 / 巡更", online: "68/70", status: "正常", tone: "success" },
      { name: "办公访客防区", scope: "人脸 / 闸机 / 访客", online: "42/44", status: "关注", tone: "medium" },
      { name: "外围车辆防区", scope: "道闸 / 车牌 / 违停", online: "32/34", status: "正常", tone: "success" },
    ],
    deviceHealth: [
      { name: "视频监控", online: "1,532", offline: "58", icon: "camera", tone: "medium" },
      { name: "AI分析盒", online: "26", offline: "1", icon: "data", tone: "success" },
      { name: "门禁控制器", online: "65", offline: "3", icon: "access", tone: "medium" },
      { name: "周界主机", online: "4", offline: "0", icon: "perimeter", tone: "success" },
      { name: "道闸设备", online: "16", offline: "2", icon: "barrier", tone: "medium" },
      { name: "智能门锁", online: "125", offline: "3", icon: "lock", tone: "success" },
    ],
    accessEvents: [
      { time: "15:12:08", target: "外协人员 A-092", gate: "办公楼东闸机", method: "人脸+权限", result: "拦截", tone: "high", action: "通知安保 / 调阅视频" },
      { time: "15:09:44", target: "浙C·3E672", gate: "南门道闸", method: "车牌识别", result: "放行", tone: "success", action: "记录入园" },
      { time: "15:03:22", target: "访客 V-1806", gate: "访客中心", method: "预约码", result: "超时", tone: "medium", action: "短信提醒 / 工单跟进" },
      { time: "14:56:19", target: "员工 0317", gate: "研发楼机房", method: "门禁卡", result: "拒绝", tone: "high", action: "权限复核" },
      { time: "14:48:51", target: "运输车辆 T-21", gate: "北门货运通道", method: "车牌+预约", result: "放行", tone: "success", action: "联动称重" },
    ],
    duty: [
      { name: "在线岗亭", value: "8/8", desc: "值守正常", icon: "guard", tone: "success" },
      { name: "巡更路线", value: "12", desc: "执行中 4 条", icon: "route", tone: "success" },
      { name: "漏巡点位", value: "3", desc: "已派单复核", icon: "alarm", tone: "medium" },
      { name: "应急广播", value: "2", desc: "联动测试通过", icon: "message", tone: "success" },
    ],
    overview: {
      trend: {
        labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
        alarms: [31, 26, 22, 28, 35, 42],
        closed: [25, 22, 19, 24, 29, 33],
      },
      categories: [
        { name: "周界入侵", value: 42, color: "#ff5364" },
        { name: "通行异常", value: 31, color: "#ff9f32" },
        { name: "车辆违规", value: 24, color: "#ffd166" },
        { name: "设备离线", value: 18, color: "#2fd2ff" },
        { name: "巡更异常", value: 9, color: "#38f2a5" },
      ],
    },
  },
  accessPage: {
    kpis: [
      { label: "今日通行总量", value: "3,742", tone: "success", icon: "turnstile", sub: "员工 2,186 / 访客 138 / 车辆 1,418" },
      { label: "预约访客", value: "164", tone: "success", icon: "visitor", sub: "已入园 138 人" },
      { label: "异常拦截", value: "27", tone: "danger", icon: "alarm", sub: "高危 5 起" },
      { label: "车辆违规", value: "12", tone: "warn", icon: "car", sub: "违停 7 / 禁入 5" },
      { label: "通行设备在线", value: "98.2", unit: "%", tone: "success", icon: "turnstile", sub: "离线 2 台" },
      { label: "平均核验", value: "1.6", unit: "秒", tone: "success", icon: "access", sub: "高峰 2.9 秒" },
    ],
    gates: [
      { name: "北门岗亭", value: "536", desc: "人车混行", total: "异常 3 起", tone: "medium", icon: "guard" },
      { name: "南门道闸", value: "812", desc: "车辆进出", total: "排队 4 车", tone: "success", icon: "barrier" },
      { name: "办公楼闸机", value: "1,124", desc: "员工通行", total: "尾随 2 起", tone: "medium", icon: "turnstile" },
      { name: "访客中心", value: "138", desc: "访客登记", total: "超时 6 人", tone: "medium", icon: "visitor" },
      { name: "研发楼门禁", value: "406", desc: "权限核验", total: "拒绝 4 次", tone: "high", icon: "access" },
      { name: "仓储门锁", value: "286", desc: "门锁记录", total: "异常 2 次", tone: "medium", icon: "lock" },
    ],
    mapKpis: [
      { label: "员工通行", metricLabel: "今日", value: "2,186", unit: "人次", sub: "高峰 08:20-08:50", tone: "success", icon: "turnstile" },
      { label: "车辆通行", metricLabel: "今日", value: "1,418", unit: "车次", sub: "货运车辆 246", tone: "success", icon: "car" },
      { label: "访客预约", metricLabel: "入园", value: "138", unit: "人", sub: "待离园 42 人", tone: "warn", icon: "visitor" },
      { label: "重点区域", metricLabel: "拦截", value: "5", unit: "起", sub: "研发楼 / 仓储区", tone: "danger", icon: "access" },
      { label: "通行效率", metricLabel: "均时", value: "1.6", unit: "秒", sub: "拥堵 1 处", tone: "success", icon: "process" },
    ],
    mapPoints: [
      { x: 18, y: 24, label: "北门岗亭", type: "guard", tone: "medium", icon: "guard" },
      { x: 30, y: 18, label: "货运预约", type: "car", tone: "normal", icon: "car" },
      { x: 47, y: 24, label: "研发楼门禁", type: "access", tone: "high", icon: "access" },
      { x: 64, y: 21, label: "办公楼闸机", type: "turnstile", tone: "medium", icon: "turnstile" },
      { x: 79, y: 31, label: "访客中心", type: "visitor", tone: "medium", icon: "visitor" },
      { x: 25, y: 52, label: "西门临停", type: "car", tone: "medium", icon: "car" },
      { x: 44, y: 51, label: "车间门禁", type: "access", tone: "normal", icon: "access" },
      { x: 63, y: 51, label: "消防通道", type: "car", tone: "high", icon: "alarm" },
      { x: 84, y: 58, label: "东门道闸", type: "barrier", tone: "normal", icon: "barrier" },
      { x: 17, y: 78, label: "南门道闸", type: "barrier", tone: "normal", icon: "barrier" },
      { x: 53, y: 79, label: "仓储门锁", type: "lock", tone: "medium", icon: "lock" },
      { x: 78, y: 75, label: "访客滞留", type: "visitor", tone: "medium", icon: "visitor" },
    ],
    realtime: [
      { time: "16:05:18", target: "员工 0526", gate: "办公楼东闸机", method: "人脸核验", result: "放行", tone: "success", action: "记录通行" },
      { time: "16:03:44", target: "外协 A-173", gate: "研发楼机房", method: "访客码+权限", result: "拒绝", tone: "high", action: "通知安保" },
      { time: "15:58:26", target: "浙C·6F902", gate: "南门道闸", method: "车牌识别", result: "放行", tone: "success", action: "联动称重" },
      { time: "15:51:11", target: "访客 V-2108", gate: "访客中心", method: "预约码", result: "超时", tone: "medium", action: "短信提醒" },
      { time: "15:43:02", target: "运输车辆 T-31", gate: "北门岗亭", method: "车牌+预约", result: "拦截", tone: "high", action: "人工复核" },
      { time: "15:36:47", target: "员工 0198", gate: "仓储区门锁", method: "门禁卡", result: "放行", tone: "success", action: "记录开门" },
    ],
    riskQueue: [
      { name: "外协人员 A-173", scope: "研发楼机房", online: "越权", status: "复核", tone: "high" },
      { name: "访客 V-2108", scope: "访客中心", online: "超时 38 分", status: "提醒", tone: "medium" },
      { name: "浙C·8K215", scope: "消防通道", online: "停留 12 分", status: "派单", tone: "medium" },
      { name: "货运 T-31", scope: "北门岗亭", online: "预约不符", status: "拦截", tone: "high" },
    ],
    laneStatus: [
      { label: "北门货运", value: "4", tone: "warn" },
      { label: "南门访客", value: "2", tone: "success" },
      { label: "办公闸机", value: "0", tone: "success" },
    ],
    overview: {
      trend: {
        labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
        alarms: [386, 612, 438, 684, 826, 520],
        closed: [362, 586, 421, 650, 792, 506],
      },
      categories: [
        { name: "办公楼闸机", value: 1124, color: "#2fd2ff" },
        { name: "南门道闸", value: 812, color: "#38f2a5" },
        { name: "北门岗亭", value: 536, color: "#ff9f32" },
        { name: "研发楼门禁", value: 406, color: "#ffd166" },
        { name: "仓储门锁", value: 286, color: "#ff5364" },
      ],
    },
  },
  productionDashboard: {
    kpis: [
      { label: "今日计划", value: "1,280", unit: "件", tone: "normal", icon: "process", sub: "A/B/C 三条产线" },
      { label: "已完成", value: "846", unit: "件", tone: "success", icon: "data", sub: "完成率 66.1%" },
      { label: "在制品", value: "312", unit: "件", tone: "warn", icon: "iot", sub: "装配段 126 件" },
      { label: "准时交付", value: "93.4", unit: "%", tone: "success", icon: "message", sub: "延期风险 2 单" },
      { label: "一次合格率", value: "97.8", unit: "%", tone: "success", icon: "alarm", sub: "返工 18 件" },
      { label: "设备稼动率", value: "88.6", unit: "%", tone: "warn", icon: "server", sub: "停机 2 台" },
    ],
    lines: [
      { name: "A线 注塑成型", value: "328", desc: "今日产出", total: "节拍 42 秒 / 达成 72%", tone: "success", icon: "process" },
      { name: "B线 精密装配", value: "286", desc: "今日产出", total: "节拍 58 秒 / 达成 64%", tone: "medium", icon: "iot" },
      { name: "C线 测试包装", value: "232", desc: "今日产出", total: "节拍 51 秒 / 达成 61%", tone: "medium", icon: "data" },
      { name: "返工工位", value: "18", desc: "待处理", total: "外观 9 / 尺寸 6 / 功能 3", tone: "high", icon: "alarm" },
      { name: "换型准备", value: "2", desc: "进行中", total: "B线 16:40 / C线 18:10", tone: "medium", icon: "switch" },
      { name: "物料齐套", value: "96.5", desc: "齐套率 %", total: "缺料 3 项", tone: "success", icon: "server" },
    ],
    processSteps: ["领料上线", "注塑成型", "冷却定型", "精密装配", "功能测试", "外观检验", "包装入库"],
    stations: [
      { name: "领料上线", plan: "1,280", done: "1,042", percent: 81, status: "正常", tone: "success" },
      { name: "注塑成型", plan: "1,020", done: "846", percent: 83, status: "正常", tone: "success" },
      { name: "冷却定型", plan: "980", done: "804", percent: 82, status: "正常", tone: "success" },
      { name: "精密装配", plan: "920", done: "612", percent: 67, status: "关注", tone: "medium" },
      { name: "功能测试", plan: "760", done: "488", percent: 64, status: "排队", tone: "medium" },
      { name: "外观检验", plan: "720", done: "456", percent: 63, status: "正常", tone: "success" },
      { name: "包装入库", plan: "680", done: "398", percent: 59, status: "待提速", tone: "medium" },
    ],
    orders: [
      { id: "MO-0523-01", event: "阀体组件 A 批次", owner: "A线", sla: "18:30", status: "生产中", tone: "success" },
      { id: "MO-0523-02", event: "传感器壳体 B 批次", owner: "B线", sla: "20:00", status: "换型中", tone: "medium" },
      { id: "MO-0523-03", event: "控制盒 C 批次", owner: "C线", sla: "21:30", status: "测试中", tone: "medium" },
      { id: "MO-0523-04", event: "小批试制 D 批次", owner: "试制线", sla: "明日 10:00", status: "待上线", tone: "low" },
    ],
    quality: [
      { name: "尺寸偏差", scope: "注塑成型 / 卡尺抽检", online: "6 件", status: "复检", tone: "medium" },
      { name: "外观划伤", scope: "装配转运 / 目检", online: "9 件", status: "返工", tone: "high" },
      { name: "功能不良", scope: "测试台 2# / 电测", online: "3 件", status: "分析", tone: "medium" },
      { name: "批次留样", scope: "A线 0523-A06", online: "12 件", status: "已留样", tone: "success" },
    ],
    bottlenecks: [
      { name: "B线装配工位", value: "58 秒", percent: 88, tone: "medium" },
      { name: "功能测试台", value: "排队 46 件", percent: 76, tone: "high" },
      { name: "包装贴标", value: "待包装 72 件", percent: 64, tone: "medium" },
      { name: "物料 K-17", value: "余量 3.5h", percent: 38, tone: "high" },
      { name: "模具 M-03", value: "保养后 6h", percent: 28, tone: "success" },
    ],
    materials: [
      { label: "主料齐套", value: "98", tone: "success" },
      { label: "辅料齐套", value: "94", tone: "warn" },
      { label: "工装可用", value: "21", tone: "success" },
    ],
    overview: {
      trend: {
        labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
        alarms: [96, 214, 328, 468, 612, 846],
        closed: [92, 205, 316, 452, 590, 812],
      },
      categories: [
        { name: "注塑成型", value: 328, color: "#2fd2ff" },
        { name: "精密装配", value: 286, color: "#38f2a5" },
        { name: "测试包装", value: 232, color: "#ff9f32" },
        { name: "返工处理", value: 18, color: "#ff5364" },
        { name: "待入库", value: 96, color: "#ffd166" },
      ],
    },
  },
  energySituation: {
    kpis: [
      { label: "今日用电", value: "9,650", unit: "kWh", tone: "normal", icon: "energy", sub: "同比 +9.04%" },
      { label: "当前负荷", value: "952", unit: "kW", tone: "success", icon: "energy", sub: "低于峰值 24.7%" },
      { label: "光伏发电", value: "2,186", unit: "kWh", tone: "success", icon: "solar", sub: "自发自用 86%" },
      { label: "储能 SOC", value: "68", unit: "%", tone: "success", icon: "battery", sub: "充/放 120/80 kW" },
      { label: "异常耗能", value: "4", tone: "warn", icon: "alarm", sub: "处理中 3 起" },
      { label: "远程控制", value: "26", tone: "success", icon: "switch", sub: "成功率 100%" },
    ],
    feeders: [
      { name: "生产车间", value: "4,126", desc: "今日 kWh", total: "峰值 1,256 kW", tone: "warn", icon: "energy" },
      { name: "研发楼", value: "1,842", desc: "今日 kWh", total: "异常波动 1 起", tone: "medium", icon: "screen" },
      { name: "办公楼", value: "1,236", desc: "今日 kWh", total: "非工作用能 2 起", tone: "medium", icon: "data" },
      { name: "仓储冷库", value: "1,018", desc: "今日 kWh", total: "负荷稳定", tone: "success", icon: "server" },
      { name: "室外照明", value: "428", desc: "今日 kWh", total: "策略节能 12%", tone: "success", icon: "iot" },
      { name: "充电桩", value: "1,000", desc: "今日 kWh", total: "排队 3 枪", tone: "medium", icon: "battery" },
    ],
    strategies: [
      { name: "晚高峰放电", scope: "17:30-20:30 / 储能 PCS", online: "80 kW", status: "执行中", tone: "success" },
      { name: "空压机错峰", scope: "1#、2#空压机轮启", online: "预计降峰 92 kW", status: "待确认", tone: "medium" },
      { name: "照明分区", scope: "办公楼 3-5F / 园区路灯", online: "节电 48 kWh", status: "已执行", tone: "success" },
      { name: "冷库稳态", scope: "仓储冷库温控回路", online: "负荷波动 6%", status: "正常", tone: "success" },
    ],
    loadBalance: [
      { label: "市电购电", value: "7,464", unit: "kWh", tone: "normal", icon: "energy" },
      { label: "光伏自用", value: "1,880", unit: "kWh", tone: "success", icon: "solar" },
      { label: "上网余电", value: "306", unit: "kWh", tone: "success", icon: "solar" },
      { label: "储能放电", value: "640", unit: "kWh", tone: "success", icon: "battery" },
    ],
  },
  energyAnalysis: {
    kpis: [
      { label: "本月用电", value: "212,400", unit: "kWh", tone: "normal", icon: "energy", sub: "预算占用 68%" },
      { label: "峰谷节省", value: "18.6", unit: "万", tone: "success", icon: "battery", sub: "储能调度贡献" },
      { label: "光伏收益", value: "3.8", unit: "万", tone: "success", icon: "solar", sub: "本月累计" },
      { label: "高耗能设备", value: "12", tone: "warn", icon: "server", sub: "建议复核 5 台" },
      { label: "节能空间", value: "9.7", unit: "%", tone: "success", icon: "process", sub: "照明/空调优先" },
      { label: "异常闭环率", value: "86.4", unit: "%", tone: "warn", icon: "alarm", sub: "未闭环 3 起" },
    ],
    ranking: [
      { name: "1#空压机", value: "1,256 kW", percent: 96, tone: "high" },
      { name: "注塑线 A", value: "1,082 kW", percent: 82, tone: "medium" },
      { name: "仓储冷库", value: "846 kW", percent: 64, tone: "success" },
      { name: "研发楼空调", value: "392 kW", percent: 42, tone: "medium" },
      { name: "室外照明", value: "78 kW", percent: 24, tone: "success" },
    ],
    suggestions: [
      { item: "生产车间 1#配电柜", issue: "峰值连续 3 次越限", action: "错峰启动空压机", saving: "约 6.2%" },
      { item: "办公楼照明回路", issue: "非工作时段用能", action: "启用分区定时策略", saving: "约 11.8%" },
      { item: "储能系统", issue: "晚高峰放电不足", action: "调整 17:00-20:00 策略", saving: "约 3.4 万/月" },
      { item: "光伏逆变器", issue: "局部效率偏低", action: "清洗组件并校验逆变器", saving: "约 2.1%" },
    ],
    branchUsage: [
      { name: "动力用电", day: "5,284", dayLabel: "今日 kWh", month: "116,800", monthLabel: "本月 kWh", icon: "energy", tone: "cyan" },
      { name: "空调用电", day: "1,426", dayLabel: "今日 kWh", month: "31,260", monthLabel: "本月 kWh", icon: "screen", tone: "success" },
      { name: "照明插座", day: "928", dayLabel: "今日 kWh", month: "19,840", monthLabel: "本月 kWh", icon: "iot", tone: "success" },
      { name: "冷链设备", day: "1,018", dayLabel: "今日 kWh", month: "24,520", monthLabel: "本月 kWh", icon: "server", tone: "cyan" },
    ],
    shiftCompare: [
      { name: "早班", scope: "08:00-16:00", online: "4,920 kWh", status: "正常", tone: "success" },
      { name: "中班", scope: "16:00-24:00", online: "3,860 kWh", status: "偏高", tone: "medium" },
      { name: "夜间保载", scope: "00:00-08:00", online: "1,126 kWh", status: "关注", tone: "medium" },
    ],
    overview: {
      trend: {
        labels: ["1周", "2周", "3周", "4周", "本周", "预测"],
        alarms: [48, 52, 46, 55, 50, 47],
        closed: [9, 11, 13, 14, 16, 18],
      },
      categories: [
        { name: "动力", value: 1168, color: "#2fd2ff" },
        { name: "空调", value: 313, color: "#38f2a5" },
        { name: "冷链", value: 245, color: "#ff9f32" },
        { name: "照明", value: 198, color: "#ffd166" },
        { name: "充电", value: 126, color: "#ff5364" },
      ],
    },
  },
  deviceOverview: {
    kpis: [
      { label: "接入设备", value: "3,256", tone: "success", icon: "iot", sub: "在线 3,126" },
      { label: "异常设备", value: "24", tone: "warn", icon: "alarm", sub: "高危 5 台" },
      { label: "离线设备", value: "130", tone: "danger", icon: "server", sub: "超过 24h：18 台" },
      { label: "视频在线率", value: "95.8", unit: "%", tone: "success", icon: "camera", sub: "故障 15 路" },
      { label: "门禁在线率", value: "95.6", unit: "%", tone: "success", icon: "access", sub: "离线 3 台" },
      { label: "运维工单", value: "18", tone: "warn", icon: "process", sub: "今日新增 7 单" },
    ],
    groups: [
      { name: "视频监控", scope: "摄像机 / 录像机 / AI盒", online: "1,532/1,599", status: "关注", tone: "medium" },
      { name: "门禁通行", scope: "门禁 / 人闸 / 道闸", online: "103/111", status: "正常", tone: "success" },
      { name: "周界系统", scope: "周界主机 / 防区探测", online: "4/4", status: "正常", tone: "success" },
      { name: "能源采集", scope: "电表 / 网关 / 储能", online: "286/291", status: "关注", tone: "medium" },
      { name: "应急设施", scope: "广播 / 岗亭 / 巡更", online: "42/45", status: "正常", tone: "success" },
    ],
    maintenance: [
      { id: "YW-2408", event: "仓储区摄像机离线", owner: "弱电组", sla: "18:20", status: "处理中", tone: "medium" },
      { id: "YW-2407", event: "南门道闸雷达误触发", owner: "通行组", sla: "35:10", status: "待备件", tone: "high" },
      { id: "YW-2406", event: "2#电表数据中断", owner: "能源组", sla: "12:45", status: "已派单", tone: "medium" },
      { id: "YW-2405", event: "广播分区巡检", owner: "安保组", sla: "48:00", status: "计划中", tone: "low" },
    ],
    lifecycle: [
      { name: "质保内", scope: "摄像机 / 门禁 / 能源表", online: "2,486 台", status: "正常", tone: "success" },
      { name: "质保到期 90 天", scope: "录像机 / 闸机控制器", online: "214 台", status: "提醒", tone: "medium" },
      { name: "固件待升级", scope: "AI盒 / 门禁控制器", online: "37 台", status: "排期", tone: "medium" },
      { name: "备件不足", scope: "道闸雷达 / 门锁电池", online: "6 类", status: "补货", tone: "high" },
    ],
    overview: {
      trend: {
        labels: ["周一", "周二", "周三", "周四", "周五", "今日"],
        alarms: [31, 28, 35, 24, 29, 24],
        closed: [20, 24, 27, 21, 26, 18],
      },
      categories: [
        { name: "摄像机", value: 1599, color: "#2fd2ff" },
        { name: "能源采集", value: 291, color: "#38f2a5" },
        { name: "门禁门锁", value: 196, color: "#ff9f32" },
        { name: "通行闸机", value: 42, color: "#ffd166" },
        { name: "应急值守", value: 45, color: "#ff5364" },
      ],
    },
  },
  commandCenter: {
    kpis: [
      { label: "今日联动事件", value: "42", tone: "warn", icon: "process", sub: "自动联动 31 起" },
      { label: "高危指挥", value: "7", tone: "danger", icon: "alarm", sub: "视频复核中 2 起" },
      { label: "平均响应", value: "3.2", unit: "分", tone: "success", icon: "message", sub: "目标 5 分钟" },
      { label: "在线队伍", value: "8", tone: "success", icon: "guard", sub: "安保/运维/消防" },
      { label: "广播联动", value: "12", tone: "success", icon: "message", sub: "成功率 100%" },
      { label: "未闭环", value: "9", tone: "warn", icon: "alarm", sub: "超时 3 起" },
    ],
    steps: ["事件触发", "视频复核", "联动派单", "现场处置", "结果反馈", "闭环归档"],
    incidents: [
      { time: "16:08:22", title: "北侧周界入侵联动", place: "北侧 3# 防区", tone: "high", icon: "perimeter" },
      { time: "16:02:14", title: "消防通道车辆停留", place: "生产车间南通道", tone: "medium", icon: "car" },
      { time: "15:56:38", title: "研发楼机房越权", place: "研发楼二层机房", tone: "high", icon: "access" },
      { time: "15:44:09", title: "储能负荷波动", place: "储能 PCS 柜", tone: "medium", icon: "battery" },
      { time: "15:37:42", title: "访客超时联动提醒", place: "综合楼访客中心", tone: "medium", icon: "visitor" },
      { time: "15:29:18", title: "仓储门锁异常开启", place: "危化仓储区门锁", tone: "high", icon: "lock" },
      { time: "15:21:36", title: "摄像机离线派单", place: "仓储区 C2 通道", tone: "low", icon: "camera" },
      { time: "15:16:04", title: "巡更漏点补巡", place: "南侧巡更路线 4# 点", tone: "medium", icon: "route" },
      { time: "15:08:55", title: "东门道闸异常抬杆", place: "东门岗亭道闸", tone: "medium", icon: "barrier" },
      { time: "14:58:47", title: "办公楼尾随通行", place: "办公楼一层闸机", tone: "high", icon: "turnstile" },
      { time: "14:46:22", title: "广播分区联动测试", place: "生产车间南通道", tone: "low", icon: "message" },
      { time: "14:31:09", title: "能源采集网关恢复", place: "2# 电表网关", tone: "low", icon: "energy" },
      { time: "14:18:36", title: "安保队伍到场反馈", place: "北侧围栏 3# 防区", tone: "low", icon: "guard" },
      { time: "14:05:11", title: "重点车辆入园复核", place: "北门货运通道", tone: "medium", icon: "car" },
    ],
    teams: [
      { name: "安保一组", scope: "北门 / 办公楼", online: "6/6", status: "出动", tone: "medium" },
      { name: "安保二组", scope: "南门 / 车间", online: "5/5", status: "待命", tone: "success" },
      { name: "运维值班", scope: "弱电 / 能源", online: "4/4", status: "处理中", tone: "medium" },
      { name: "消防应急", scope: "消防 / 广播", online: "8/8", status: "待命", tone: "success" },
    ],
    mapKpis: [
      { label: "处置中事件", metricLabel: "当前", value: "9", unit: "起", sub: "高危 2 起", tone: "danger", icon: "alarm" },
      { label: "视频复核", metricLabel: "成功率", value: "98.6", unit: "%", sub: "调阅 42 路", tone: "success", icon: "camera" },
      { label: "应急广播", metricLabel: "分区", value: "12", unit: "次", sub: "测试通过", tone: "success", icon: "message" },
      { label: "派遣队伍", metricLabel: "在线", value: "23", unit: "人", sub: "已出动 6 人", tone: "warn", icon: "guard" },
      { label: "平均响应", metricLabel: "今日", value: "3.2", unit: "分", sub: "目标 5 分", tone: "success", icon: "process" },
    ],
    mapPoints: [
      { x: 18, y: 22, label: "北侧周界", type: "alarm", tone: "high", icon: "perimeter" },
      { x: 31, y: 18, label: "复核摄像机", type: "camera", tone: "normal", icon: "camera" },
      { x: 46, y: 23, label: "机房越权", type: "access", tone: "high", icon: "access" },
      { x: 64, y: 20, label: "广播分区", type: "message", tone: "normal", icon: "message" },
      { x: 79, y: 30, label: "访客中心", type: "visitor", tone: "medium", icon: "visitor" },
      { x: 25, y: 52, label: "安保一组", type: "guard", tone: "medium", icon: "guard" },
      { x: 43, y: 50, label: "车间南通道", type: "car", tone: "medium", icon: "car" },
      { x: 63, y: 51, label: "现场处置", type: "process", tone: "medium", icon: "process" },
      { x: 84, y: 58, label: "东门待命", type: "guard", tone: "normal", icon: "guard" },
      { x: 17, y: 78, label: "南门道闸", type: "barrier", tone: "normal", icon: "barrier" },
      { x: 53, y: 79, label: "能源运维", type: "battery", tone: "medium", icon: "battery" },
      { x: 78, y: 75, label: "巡更补点", type: "route", tone: "medium", icon: "route" },
    ],
    resources: [
      { name: "视频坐席", scope: "调阅 / 云台 / 截图", online: "4/4", status: "在线", tone: "success" },
      { name: "应急物资", scope: "反光锥 / 对讲 / 破拆", online: "32 套", status: "充足", tone: "success" },
      { name: "巡逻车辆", scope: "园区巡逻 / 现场支援", online: "2/3", status: "出动", tone: "medium" },
      { name: "联络链路", scope: "短信 / 电话 / 广播", online: "98.4%", status: "正常", tone: "success" },
    ],
    timeline: [
      { time: "16:08", target: "北侧周界", gate: "3# 防区", method: "热成像+视频", result: "复核中", tone: "high", action: "安保一组出动" },
      { time: "16:10", target: "消防通道", gate: "车间南侧", method: "车牌+视频", result: "已派单", tone: "medium", action: "广播提醒" },
      { time: "16:14", target: "研发楼机房", gate: "二层门禁", method: "门禁+人脸", result: "拦截", tone: "high", action: "权限复核" },
      { time: "16:18", target: "储能 PCS", gate: "能源站", method: "电表+网关", result: "处理中", tone: "medium", action: "运维到场" },
    ],
    overview: {
      trend: {
        labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
        alarms: [12, 9, 7, 11, 14, 16],
        closed: [10, 8, 6, 9, 12, 13],
      },
      categories: [
        { name: "安防联动", value: 18, color: "#ff5364" },
        { name: "通行管控", value: 9, color: "#ff9f32" },
        { name: "能源处置", value: 6, color: "#ffd166" },
        { name: "设备运维", value: 5, color: "#2fd2ff" },
        { name: "巡更补点", value: 4, color: "#38f2a5" },
      ],
    },
  },
  aiAgents: {
    "综合态势": {
      name: "总控态势分析助手",
      short: "综合态势研判",
      icon: "data",
      tone: "normal",
      tags: ["数据分析", "态势问答", "图表生成"],
      welcome: "我可以围绕综合态势页，回答安防告警、通行管控、能源预警和设备接入的静态分析问题。",
      questions: [
        {
          id: "overall-risk",
          label: "今天综合风险怎么看？",
          keywords: ["综合风险", "整体风险", "态势", "风险怎么看"],
          answer: {
            text: "当前综合风险主要集中在安防告警和能源越限两个方向，闭环率保持在 92.6%，但高危告警 23 起、未处置 9 起需要优先关注。",
            bullets: ["先处理周界入侵、重点人员命中和越权进入。", "能源侧重点关注生产车间 1# 配电柜高耗能预警。", "设备侧摄像头与智能门锁离线会影响处置闭环证据链。"],
            cards: [
              { label: "今日告警", value: "128", unit: "起", sub: "高危 23 起", tone: "high" },
              { label: "未处置", value: "9", unit: "起", sub: "需值班跟进", tone: "medium" },
              { label: "闭环率", value: "92.6", unit: "%", sub: "处置链路正常", tone: "success" },
            ],
          },
        },
        {
          id: "overall-chart",
          label: "生成告警趋势小图",
          keywords: ["告警趋势", "生成图表", "趋势图", "小图"],
          answer: {
            text: "已按当前静态数据生成告警趋势小图。10:00 左右告警量最高，后续处置数量基本跟随增长。",
            trend: {
              title: "今日告警趋势",
              summary: "峰值 41 起",
              labels: ["06", "08", "10", "12", "14", "16"],
              points: [18, 26, 41, 32, 29, 22],
            },
            bars: [
              { label: "周界入侵", value: "36", percent: 100, tone: "high" },
              { label: "门禁异常", value: "24", percent: 67, tone: "medium" },
              { label: "车辆违规", value: "18", percent: 50, tone: "medium" },
              { label: "访客违规", value: "14", percent: 39, tone: "success" },
            ],
          },
        },
        {
          id: "overall-action",
          label: "现在应该先处理什么？",
          keywords: ["先处理", "优先", "处置建议", "怎么处理"],
          answer: {
            text: "建议按风险等级和联动影响排序，先处理北侧防区周界入侵、办公楼人脸闸机重点人员命中，再复核生产车间高耗能预警。",
            bullets: ["高危告警进入视频复核和现场派单。", "能源越限同步通知能源值班组查看负荷曲线。", "离线设备安排弱电组排查，避免影响后续取证。"],
          },
        },
        {
          id: "overall-module",
          label: "这个页面主要看哪些模块？",
          keywords: ["页面模块", "看哪些", "模块解释", "综合态势"],
          answer: {
            text: "综合态势页是总览入口，核心看左侧安防闭环、中间园区态势图、右侧能源与预警、底部设备接入和颗粒度指标。",
            bullets: ["左侧用于判断事件和通行风险。", "中间用于定位点位和联动空间位置。", "右侧用于看能源态势及异常对象。", "底部用于确认设备底座和指标分布。"],
          },
        },
      ],
    },
    "综合安防": {
      name: "安防研判助手",
      short: "告警闭环分析",
      icon: "alarm",
      tone: "danger",
      tags: ["告警研判", "点位健康", "闭环建议"],
      welcome: "我可以围绕综合安防页，分析实时告警、处置工单、防区点位、巡更值守和安防趋势。",
      questions: [
        {
          id: "security-risk",
          label: "当前安防风险重点是什么？",
          keywords: ["安防风险", "风险重点", "高危", "告警"],
          answer: {
            text: "当前重点是北侧周界、办公楼闸机尾随和消防通道车辆停留。待处置事件 18 起，其中高危联动 7 起，巡更到位率 92.6%。",
            cards: [
              { label: "待处置", value: "18", unit: "起", sub: "超时 3 起", tone: "medium" },
              { label: "高危联动", value: "7", unit: "起", sub: "视频复核 5 起", tone: "high" },
              { label: "视频在线率", value: "96.4", unit: "%", sub: "离线 58 路", tone: "success" },
            ],
            bullets: ["优先复核危化仓周界触发和陌生人尾随通行。", "摄像机离线需同步派发运维工单。"],
          },
        },
        {
          id: "security-chart",
          label: "生成安防趋势图",
          keywords: ["安防趋势", "趋势图", "图表", "类型"],
          answer: {
            text: "已生成综合安防趋势小图。15:00 告警升至 42 起，闭环 33 起，说明处置压力在下午后段上升。",
            trend: {
              title: "告警与闭环",
              summary: "15:00 最高",
              labels: ["10", "11", "12", "13", "14", "15"],
              points: [31, 26, 22, 28, 35, 42],
            },
            bars: [
              { label: "周界入侵", value: "42", percent: 100, tone: "high" },
              { label: "通行异常", value: "31", percent: 74, tone: "medium" },
              { label: "车辆违规", value: "24", percent: 57, tone: "medium" },
              { label: "设备离线", value: "18", percent: 43, tone: "success" },
            ],
          },
        },
        {
          id: "security-action",
          label: "处置工单怎么排优先级？",
          keywords: ["工单", "优先级", "派单", "处置"],
          answer: {
            text: "优先级建议按高危程度、SLA 倒计时、是否影响视频取证排序。GD-1525 尾随通行核验剩余 02:42，应置顶处理。",
            bullets: ["GD-1525：高危尾随通行，先复核人员身份和视频。", "GD-1526：周界入侵复核，保持现场安保到场。", "GD-1523：摄像机离线，影响取证链路，需弱电组跟进。"],
          },
        },
        {
          id: "security-module",
          label: "安防页的核心模块是什么？",
          keywords: ["核心模块", "安防页", "模块", "页面说明"],
          answer: {
            text: "综合安防页围绕事件闭环设计，重点由实时告警、工单队列、一张图、防区状态、设备健康、通行明细和巡更趋势组成。",
            bullets: ["左侧负责事件输入和工单处置。", "中间负责定位和联动视图。", "右侧负责点位、防区和设备健康。", "底部负责通行、巡更和趋势复盘。"],
          },
        },
      ],
    },
    "生产驾驶舱": {
      name: "生产分析助手",
      short: "产线与瓶颈分析",
      icon: "process",
      tone: "normal",
      tags: ["产能分析", "质量返工", "瓶颈识别"],
      welcome: "我可以围绕生产驾驶舱页，分析产线产能、工单进度、质量返工、瓶颈工位和物料约束。",
      questions: [
        {
          id: "production-status",
          label: "今天生产达成情况如何？",
          keywords: ["生产达成", "完成率", "产能", "今天生产"],
          answer: {
            text: "今日计划 1,280 件，已完成 846 件，完成率 66.1%。A 线产出 328 件表现最好，B 线装配和功能测试台是主要瓶颈。",
            cards: [
              { label: "今日计划", value: "1,280", unit: "件", sub: "A/B/C 三条产线", tone: "normal" },
              { label: "已完成", value: "846", unit: "件", sub: "完成率 66.1%", tone: "success" },
              { label: "在制品", value: "312", unit: "件", sub: "装配段 126 件", tone: "medium" },
            ],
            bullets: ["B线精密装配达成 64%，需要关注节拍。", "功能测试台排队 46 件，会影响包装入库。"],
          },
        },
        {
          id: "production-chart",
          label: "生成产线产出排行",
          keywords: ["产线排行", "产出排行", "生成图表", "生产图表"],
          answer: {
            text: "已按当前产线数据生成排行。注塑成型产出最高，测试包装和返工处理需要跟踪。",
            bars: [
              { label: "注塑成型", value: "328", percent: 100, tone: "success" },
              { label: "精密装配", value: "286", percent: 87, tone: "medium" },
              { label: "测试包装", value: "232", percent: 71, tone: "medium" },
              { label: "返工处理", value: "18", percent: 18, tone: "high" },
            ],
            trend: {
              title: "累计产出",
              summary: "18:00 达 846 件",
              labels: ["08", "10", "12", "14", "16", "18"],
              points: [96, 214, 328, 468, 612, 846],
            },
          },
        },
        {
          id: "production-bottleneck",
          label: "瓶颈应该怎么处理？",
          keywords: ["瓶颈", "物料", "节拍", "怎么处理"],
          answer: {
            text: "当前瓶颈优先级是功能测试台、B线装配工位、物料 K-17。建议先临时增开测试台或调整包装节奏，避免测试排队继续放大。",
            bullets: ["功能测试台排队 46 件，优先安排人员和测试夹具。", "B线装配节拍 58 秒，需复核工装和人员配置。", "物料 K-17 余量 3.5h，应提前触发补料。"],
          },
        },
        {
          id: "production-module",
          label: "生产页主要看什么？",
          keywords: ["生产页", "模块", "看什么", "页面说明"],
          answer: {
            text: "生产驾驶舱用于看计划达成、产线运行、工单进度、车间可视化、质量返工和瓶颈物料约束。",
            bullets: ["顶部 KPI 判断整体达成与交付风险。", "左侧看产线和工单。", "中间看平面或 3D 车间状态。", "右侧看质量、返工、瓶颈和物料。"],
          },
        },
      ],
    },
    "智慧通行": {
      name: "通行管控助手",
      short: "人车通行分析",
      icon: "turnstile",
      tone: "success",
      tags: ["通行分析", "访客研判", "异常拦截"],
      welcome: "我可以围绕智慧通行页，回答人车通行、访客滞留、异常拦截、点位排行和通行效率问题。",
      questions: [
        {
          id: "access-status",
          label: "当前通行是否正常？",
          keywords: ["通行正常", "通行情况", "人车", "是否正常"],
          answer: {
            text: "整体通行正常，今日通行总量 3,742，设备在线率 98.2%，但异常拦截 27 起、车辆违规 12 起需要关注。",
            cards: [
              { label: "通行总量", value: "3,742", unit: "次", sub: "员工/访客/车辆", tone: "success" },
              { label: "异常拦截", value: "27", unit: "起", sub: "高危 5 起", tone: "high" },
              { label: "平均核验", value: "1.6", unit: "秒", sub: "高峰 2.9 秒", tone: "success" },
            ],
            bullets: ["研发楼机房外协越权需要安保复核。", "访客 V-2108 超时 38 分，建议短信提醒并人工确认。"],
          },
        },
        {
          id: "access-chart",
          label: "生成通行点位排行",
          keywords: ["通行排行", "点位排行", "生成图表", "排行"],
          answer: {
            text: "已生成通行点位排行。办公楼闸机通行量最高，南门道闸和北门岗亭处于高频使用状态。",
            bars: [
              { label: "办公楼闸机", value: "1,124", percent: 100, tone: "success" },
              { label: "南门道闸", value: "812", percent: 72, tone: "success" },
              { label: "北门岗亭", value: "536", percent: 48, tone: "medium" },
              { label: "研发楼门禁", value: "406", percent: 36, tone: "medium" },
            ],
            trend: {
              title: "通行趋势",
              summary: "16:00 达 826",
              labels: ["08", "10", "12", "14", "16", "18"],
              points: [386, 612, 438, 684, 826, 520],
            },
          },
        },
        {
          id: "access-action",
          label: "异常通行怎么处置？",
          keywords: ["异常通行", "拦截", "访客", "处置"],
          answer: {
            text: "建议先处理外协人员越权、货运预约不符和访客超时三类事件，分别走权限复核、人工核验、短信提醒和工单跟进。",
            bullets: ["外协 A-173：研发楼机房越权，通知安保并调阅视频。", "货运 T-31：预约不符，保持北门岗亭人工复核。", "访客 V-2108：超时 38 分，短信提醒并确认离园。"],
          },
        },
        {
          id: "access-module",
          label: "通行页有哪些重点模块？",
          keywords: ["通行页", "模块", "重点模块", "页面说明"],
          answer: {
            text: "智慧通行页重点看顶部通行 KPI、左侧点位状态和实时流水、中间一张图、右侧趋势排行和访客车辆处置。",
            bullets: ["KPI 用于判断总量、异常和效率。", "实时流水用于定位具体对象。", "趋势排行用于识别拥堵或异常点位。", "处置队列用于跟踪访客、车辆和外协人员风险。"],
          },
        },
      ],
    },
    "能源驾驶舱": {
      name: "能源优化助手",
      short: "能耗与光储分析",
      icon: "energy",
      tone: "normal",
      tags: ["能耗分析", "光储协同", "节能建议"],
      welcome: "我可以围绕能源驾驶舱页，分析用电负荷、高耗能设备、光伏储能、分区负荷和节能优化建议。",
      questions: [
        {
          id: "energy-status",
          label: "今天能耗是否异常？",
          keywords: ["能耗异常", "能源异常", "用电", "负荷"],
          answer: {
            text: "今日用电 9,650 kWh，同比 +9.04%。当前负荷 952 kW，低于峰值 24.7%，但异常耗能 4 起，其中生产车间 1# 配电柜峰值越限最明显。",
            cards: [
              { label: "今日用电", value: "9,650", unit: "kWh", sub: "同比 +9.04%", tone: "normal" },
              { label: "当前负荷", value: "952", unit: "kW", sub: "低于峰值 24.7%", tone: "success" },
              { label: "异常耗能", value: "4", unit: "起", sub: "处理中 3 起", tone: "medium" },
            ],
            bullets: ["生产车间 1# 配电柜连续越限，建议错峰启动空压机。", "办公楼照明回路存在非工作时段用能。"],
          },
        },
        {
          id: "energy-chart",
          label: "生成高耗能设备排行",
          keywords: ["高耗能", "设备排行", "生成图表", "能耗排行"],
          answer: {
            text: "已生成高耗能设备排行。1#空压机和注塑线 A 是当前负荷重点对象。",
            bars: [
              { label: "1#空压机", value: "1,256 kW", percent: 96, tone: "high" },
              { label: "注塑线 A", value: "1,082 kW", percent: 82, tone: "medium" },
              { label: "仓储冷库", value: "846 kW", percent: 64, tone: "success" },
              { label: "研发楼空调", value: "392 kW", percent: 42, tone: "medium" },
            ],
            trend: {
              title: "日负荷走势",
              summary: "18:00 峰值 1430",
              labels: ["00", "03", "06", "09", "12", "15", "18", "21", "24"],
              points: [420, 520, 760, 1180, 1265, 1110, 1430, 1280, 952],
            },
          },
        },
        {
          id: "energy-action",
          label: "有什么节能优化建议？",
          keywords: ["节能", "优化建议", "降耗", "省电"],
          answer: {
            text: "建议优先执行空压机错峰、办公楼照明分区定时、储能晚高峰放电和光伏组件清洗校验。",
            bullets: ["空压机错峰预计降峰 92 kW。", "办公楼照明分区策略预计节电 11.8%。", "储能 17:00-20:00 策略可提升峰谷收益。", "光伏逆变器效率偏低，建议清洗组件并校验逆变器。"],
          },
        },
        {
          id: "energy-module",
          label: "能源页主要分析什么？",
          keywords: ["能源页", "模块", "分析什么", "页面说明"],
          answer: {
            text: "能源驾驶舱围绕分类用能、高耗能设备、负荷趋势、光储协同、分区负荷和优化建议展开。",
            bullets: ["左侧看能源分类和高耗能排行。", "中间看负荷趋势、能耗结构和策略执行。", "右侧看光储状态、班次用能和优化预警。"],
          },
        },
      ],
    },
    "设备总览": {
      name: "设备运维助手",
      short: "设备在线与工单",
      icon: "iot",
      tone: "normal",
      tags: ["设备健康", "运维工单", "生命周期"],
      welcome: "我可以围绕设备总览页，回答设备在线率、离线设备、运维工单、生命周期提醒和平台基础能力。",
      questions: [
        {
          id: "device-status",
          label: "设备整体健康如何？",
          keywords: ["设备健康", "在线率", "离线", "整体健康"],
          answer: {
            text: "当前接入设备 3,256 台，在线 3,126 台，异常设备 24 台、离线 130 台。视频和能源采集是需要关注的两类设备。",
            cards: [
              { label: "接入设备", value: "3,256", unit: "台", sub: "在线 3,126", tone: "success" },
              { label: "异常设备", value: "24", unit: "台", sub: "高危 5 台", tone: "medium" },
              { label: "离线设备", value: "130", unit: "台", sub: "超 24h：18 台", tone: "high" },
            ],
            bullets: ["仓储区摄像机离线会影响视频取证。", "2#电表数据中断会影响能源分析完整性。"],
          },
        },
        {
          id: "device-chart",
          label: "生成设备分类图表",
          keywords: ["设备分类", "生成图表", "分类图表", "设备图表"],
          answer: {
            text: "已生成设备分类接入图表。摄像机数量最多，能源采集和门禁门锁是设备管理的第二梯队。",
            bars: [
              { label: "摄像机", value: "1,599", percent: 100, tone: "success" },
              { label: "能源采集", value: "291", percent: 32, tone: "medium" },
              { label: "门禁门锁", value: "196", percent: 24, tone: "medium" },
              { label: "应急值守", value: "45", percent: 12, tone: "success" },
            ],
            trend: {
              title: "设备异常趋势",
              summary: "今日 24 台",
              labels: ["周一", "周二", "周三", "周四", "周五", "今日"],
              points: [31, 28, 35, 24, 29, 24],
            },
          },
        },
        {
          id: "device-action",
          label: "运维工单先处理哪些？",
          keywords: ["运维工单", "先处理", "设备工单", "维修"],
          answer: {
            text: "建议先处理南门道闸雷达误触发和仓储区摄像机离线。前者状态为待备件，后者会直接影响安防取证。",
            bullets: ["YW-2407：南门道闸雷达误触发，待备件，风险较高。", "YW-2408：仓储区摄像机离线，弱电组处理中。", "YW-2406：2#电表数据中断，能源组应补齐采集链路。"],
          },
        },
        {
          id: "device-module",
          label: "设备总览页看哪些内容？",
          keywords: ["设备总览", "模块", "看哪些", "页面说明"],
          answer: {
            text: "设备总览页用于统一看设备分类在线、运维工单、一张图、平台基础能力和生命周期提醒。",
            bullets: ["左侧看设备分类和当前工单。", "中间看分组状态和设备趋势。", "右侧看数据中台、物联中台等基础能力，以及质保、固件、备件提醒。"],
          },
        },
      ],
    },
    "联动指挥": {
      name: "指挥调度助手",
      short: "联动事件研判",
      icon: "process",
      tone: "warn",
      tags: ["事件联动", "队伍派遣", "响应效率"],
      welcome: "我可以围绕联动指挥页，分析高危联动事件、队伍在线、资源调度、处置链路和响应效率。",
      questions: [
        {
          id: "command-status",
          label: "现在指挥态势如何？",
          keywords: ["指挥态势", "联动态势", "响应", "当前指挥"],
          answer: {
            text: "今日联动事件 42 起，高危指挥 7 起，平均响应 3.2 分钟，未闭环 9 起。当前主要关注北侧周界、研发楼机房和储能 PCS。",
            cards: [
              { label: "联动事件", value: "42", unit: "起", sub: "自动联动 31 起", tone: "medium" },
              { label: "高危指挥", value: "7", unit: "起", sub: "复核中 2 起", tone: "high" },
              { label: "平均响应", value: "3.2", unit: "分", sub: "目标 5 分钟", tone: "success" },
            ],
            bullets: ["安保一组已对北侧周界事件出动。", "运维值班正在处理储能 PCS 负荷波动。"],
          },
        },
        {
          id: "command-chart",
          label: "生成联动类型图表",
          keywords: ["联动类型", "生成图表", "指挥图表", "类型图表"],
          answer: {
            text: "已生成联动类型分布。安防联动占比最高，其次是通行管控和能源处置。",
            bars: [
              { label: "安防联动", value: "18", percent: 100, tone: "high" },
              { label: "通行管控", value: "9", percent: 50, tone: "medium" },
              { label: "能源处置", value: "6", percent: 33, tone: "medium" },
              { label: "设备运维", value: "5", percent: 28, tone: "success" },
            ],
            trend: {
              title: "联动趋势",
              summary: "15:00 上升至 16",
              labels: ["10", "11", "12", "13", "14", "15"],
              points: [12, 9, 7, 11, 14, 16],
            },
          },
        },
        {
          id: "command-action",
          label: "队伍应该怎么派？",
          keywords: ["队伍", "派遣", "调度", "怎么派"],
          answer: {
            text: "建议安保一组继续处理北侧周界和办公楼事件，安保二组保持南门和车间待命，运维值班处理储能及设备派单。",
            bullets: ["安保一组：北门 / 办公楼，当前 6/6 在线，状态出动。", "安保二组：南门 / 车间，5/5 在线，适合支援消防通道车辆事件。", "运维值班：弱电 / 能源，4/4 在线，负责储能和摄像机离线。"],
          },
        },
        {
          id: "command-module",
          label: "联动指挥页怎么理解？",
          keywords: ["联动指挥", "模块", "怎么理解", "页面说明"],
          answer: {
            text: "联动指挥页用于把安防、通行、能源和设备事件汇总到统一调度视角，重点看事件队列、一张图、队伍资源和联动趋势。",
            bullets: ["左侧是待处置事件输入。", "中间是一张图定位事件、队伍和处置态势。", "右侧是队伍在线、资源可用和联动时间线。", "顶部 KPI 判断响应效率和未闭环压力。"],
          },
        },
      ],
    },
  },
  foundation: [
    { name: "数据中台", label1: "今日数据量", value1: "86.4万条", label2: "更新成功率", value2: "99.6%", icon: "data" },
    { name: "物联中台", label1: "接入设备", value1: "3,256", label2: "在线率", value2: "96.2%", icon: "iot" },
    { name: "告警中心", label1: "今日触发", value1: "128", label2: "闭环率", value2: "92.6%", icon: "alarm" },
    { name: "消息中心", label1: "短信成功率", value1: "98.6%", label2: "电话拨通率", value2: "92.3%", icon: "message" },
    { name: "权限中心", label1: "用户数", value1: "256", label2: "角色数", value2: "48", icon: "lock" },
  ],
};
