var lang={
	//模式

	modeWash:["标准洗", "混合", "牛仔",
        "大物", "内衣", "运动服",
        "筒清洁", "漂洗+脱水", "单脱水",
        '化纤', '衬衫', '快洗',
        '弱烘干', '强烘干','羊毛', '轻柔'],
    g_CurrentPow:"开机",
    cotton: 1,
    mix: 2,
    jean: 3,
    big: 4,
    underclothes: 5,
    sport: 6,
    clean: 7,
    potchAndDry: 8,
    noWater: 9,
    chemical: 10,
    shirts: 11,
    fast: 12,
    weakDry: 13,
    powerDry:14,
    wool:15,
    soft:16,
    no_voice:"语音当前不可用",

    runState1:"洗涤中",
    runState2:"漂洗",
    runState3:"脱水",
    runState4:"烘干",

    wash_coming:"您预约的洗衣时间即将开始",
    wash_complete:"洗衣完成，请取出洗衣机内的衣物",

    runStateOrder:"预约中",

    orderCancel:"取消预约",
    washEnd: "洗衣结束",

    voice_cmd_not_found:"我好像没有听明白。",
    warning_network:"网络不给力，请检查网络设置。",


    erReason_E1: "溢水故障",
    erSolve_E1: "开机会自动排水，完成后可继续运行选择模式",

    erReason_E2: "温度过高故障",
    erSolve_E2: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E3: "进水超时",
    erSolve_E3: "检查水龙头是否打开？进水管是否扭折？进水阀滤网是否堵塞？水压是否过低",

    erReason_E4: "主控板与显示板通信故障",
    erSolve_E4: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E5: "驱动故障",
    erSolve_E5: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E6: "水位传感器故障",
    erSolve_E6: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E7: "水加热感温包故障",
    erSolve_E7: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E8: "排水超时故障",
    erSolve_E8: "请检查排水管是否被堵塞或扭折，并打开排污口盖板，清洗排水泵过滤器",

    erReason_E9: "门锁故障",
    erSolve_E9: "检查门是否关好，重新启动",

    erReason_E10: "加热超时故障",
    erSolve_E10: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E11: "漏电故障",
    erSolve_E11: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_E12: "串并联电弧故障",
    erSolve_E12: "请断开洗衣机电源，等待约10秒后重新接通电源运行",


    erReason_EH1: "烘干进风感温包故障",
    erSolve_EH1: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH2: "烘干出风感温包故障",
    erSolve_EH2: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH3: "烘干风机感温包故障",
    erSolve_EH3: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH4: "烘干加热超时故障",
    erSolve_EH4: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH5: "烘干温度过高故障",
    erSolve_EH5: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH6: "烘干风机故障",
    erSolve_EH6: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH7: "冷凝阀故障",
    erSolve_EH7: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_EH8: "烘干水位超限",
    erSolve_EH8: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_JF: "Wifi检测板通讯故障",
    erSolve_JF: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_Lt: "环境温度过低保护",
    erSolve_Lt: "请移动至0℃以上的环境中放置1-2小时后再使用",

    erReason_UL: "人为强制解锁",
    erSolve_UL: "当前筒内水温过高，水位过高，或者筒还在旋转时请不要强制解锁，以免造成人身伤害或洗衣机故障。请断开电源，再重新开机",

    erReason_Ub: "脱水不平衡",
    erSolve_Ub: "将衣物取出均匀抖散，或在洗大件衣物，或者少量衣物时，适量放进一些其他衣物，若多次调整后仍无法达到平衡，洗衣机将不能升高转速，衣物无法充分脱水，请您重新分配筒内衣物",

    erReason_HHt: "烘干超时",
    erSolve_HHt: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_HLt: "降温超时",
    erSolve_HLt: "请断开洗衣机电源，等待约10秒后重新接通电源运行",

    erReason_op: "门未关闭",
    erSolve_op: "请确认门正常关闭",



	
}