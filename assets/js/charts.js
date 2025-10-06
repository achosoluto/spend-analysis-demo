// Spend Analysis Demo - Chart Configurations
// ECharts implementations for all thesis visualizations

// Color palette from CSS variables
const colors = {
    primary: '#0d1b2a',
    green: '#2ca58d',
    amber: '#f59e0b',
    neutral: '#6c757d',
    light: '#e9ecef',
    dark: '#33415c'
};

// Common chart options
const commonOptions = {
    animation: true,
    animationDuration: 300,
    textStyle: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
};

// THESIS 1: Data Clarity - Treemap
function configureTreemap(chart) {
    const option = {
        ...commonOptions,
        title: {
            text: '',
            left: 'center',
            textStyle: { color: colors.primary }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: ${c}M<br/>Confidence: {d}%'
        },
        series: [{
            type: 'treemap',
            data: getTreemapData(),
            roam: false,
            nodeClick: false,
            breadcrumb: { show: false },
            label: {
                show: true,
                formatter: '{b}',
                fontSize: 12
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                gapWidth: 2
            },
            levels: [{
                itemStyle: {
                    borderColor: colors.neutral,
                    borderWidth: 3,
                    gapWidth: 3
                }
            }]
        }]
    };
    
    chart.setOption(option);
}

function updateTreemap(chart) {
    chart.setOption({
        series: [{
            data: getTreemapData()
        }]
    }, { replaceMerge: ['series'] });
}

function getTreemapData() {
    const isAfter = AppState.scenario === 'after';
    const categories = [
        { name: 'IT Services', value: 45.2, confidence: isAfter ? 95 : 65 },
        { name: 'Professional Services', value: 38.7, confidence: isAfter ? 98 : 70 },
        { name: 'Marketing', value: 22.4, confidence: isAfter ? 92 : 75 },
        { name: 'Facilities', value: 18.9, confidence: isAfter ? 96 : 68 },
        { name: 'Travel', value: 15.6, confidence: isAfter ? 99 : 85 },
        { name: 'Office Supplies', value: 12.3, confidence: isAfter ? 94 : 72 },
        { name: 'Miscellaneous', value: isAfter ? 2.1 : 18.7, confidence: isAfter ? 45 : 25 }
    ];
    
    return categories.map(cat => ({
        name: cat.name,
        value: cat.value,
        confidence: cat.confidence,
        itemStyle: {
            color: getConfidenceColor(cat.confidence)
        }
    }));
}

// THESIS 1: Data Clarity - Sankey
function configureSankey(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [{
            type: 'sankey',
            data: getSankeyNodes(),
            links: getSankeyLinks(),
            itemStyle: {
                borderWidth: 1,
                borderColor: '#aaa'
            },
            lineStyle: {
                color: 'gradient',
                curveness: 0.5
            },
            label: {
                fontSize: 10
            },
            emphasis: {
                focus: 'adjacency'
            }
        }]
    };
    
    chart.setOption(option);
}

function updateSankey(chart) {
    chart.setOption({
        series: [{
            data: getSankeyNodes(),
            links: getSankeyLinks()
        }]
    }, { replaceMerge: ['series'] });
}

// THESIS 2: Consolidation - Pareto Chart
function configurePareto(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['Spend ($M)', 'Cumulative %'],
            top: 10
        },
        xAxis: [{
            type: 'category',
            data: getSupplierNames(),
            axisPointer: { type: 'shadow' },
            axisLabel: { rotate: 45, fontSize: 10 }
        }],
        yAxis: [{
            type: 'value',
            name: 'Spend ($M)',
            min: 0
        }, {
            type: 'value',
            name: 'Cumulative %',
            min: 0,
            max: 100,
            axisLabel: { formatter: '{value}%' }
        }],
        series: [
            {
                name: 'Spend ($M)',
                type: 'bar',
                data: getSupplierSpend(),
                itemStyle: { color: colors.green }
            },
            {
                name: 'Cumulative %',
                type: 'line',
                yAxisIndex: 1,
                data: getCumulativePercent(),
                itemStyle: { color: colors.amber },
                lineStyle: { width: 3 }
            }
        ]
    };
    
    chart.setOption(option);
}

function updatePareto(chart) {
    chart.setOption({
        series: [
            { data: getSupplierSpend() },
            { data: getCumulativePercent() }
        ]
    });
}

// THESIS 2: Consolidation - Supplier Bar Chart
function configureSupplierBar(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Before', 'After']
        },
        xAxis: {
            type: 'category',
            data: getCategoryNames()
        },
        yAxis: {
            type: 'value',
            name: 'Supplier Count'
        },
        series: [
            {
                name: 'Before',
                type: 'bar',
                data: getSupplierCountBefore(),
                itemStyle: { color: colors.amber }
            },
            {
                name: 'After',
                type: 'bar',
                data: getSupplierCountAfter(),
                itemStyle: { color: colors.green }
            }
        ]
    };
    
    chart.setOption(option);
}

function updateSupplierBar(chart) {
    // This chart shows both scenarios simultaneously
    chart.setOption({
        series: [
            { data: getSupplierCountBefore() },
            { data: getSupplierCountAfter() }
        ]
    });
}

// THESIS 3: Compliance - Stacked Bar Chart
function configureComplianceStack(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['On Contract', 'Off Contract']
        },
        xAxis: {
            type: 'category',
            data: getCategoryNames()
        },
        yAxis: {
            type: 'value',
            name: 'Spend ($M)',
            axisLabel: { formatter: '${value}M' }
        },
        series: [
            {
                name: 'On Contract',
                type: 'bar',
                stack: 'total',
                data: getOnContractSpend(),
                itemStyle: { color: colors.green }
            },
            {
                name: 'Off Contract',
                type: 'bar',
                stack: 'total',
                data: getOffContractSpend(),
                itemStyle: { color: colors.amber }
            }
        ]
    };
    
    chart.setOption(option);
}

function updateComplianceStack(chart) {
    chart.setOption({
        series: [
            { data: getOnContractSpend() },
            { data: getOffContractSpend() }
        ]
    });
}

// THESIS 3: Compliance - Heatmap
function configureHeatmap(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return `${params.data[1]} - ${params.data[0]}<br/>Maverick Spend: ${params.data[2]}%`;
            }
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: getCategoryNames(),
            splitArea: { show: true }
        },
        yAxis: {
            type: 'category',
            data: getBusinessUnits(),
            splitArea: { show: true }
        },
        visualMap: {
            min: 0,
            max: 30,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
                color: [colors.green, colors.amber, '#d73027']
            }
        },
        series: [{
            type: 'heatmap',
            data: getHeatmapData(),
            label: {
                show: true,
                formatter: '{c}%'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    chart.setOption(option);
}

function updateHeatmap(chart) {
    chart.setOption({
        series: [{ data: getHeatmapData() }]
    });
}

// THESIS 4: Price Variance - Boxplot
function configureBoxplot(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            formatter: function(param) {
                return [
                    param.name + ': ',
                    'Upper: $' + param.data[5],
                    'Q3: $' + param.data[4],
                    'Median: $' + param.data[3],
                    'Q1: $' + param.data[2],
                    'Lower: $' + param.data[1]
                ].join('<br/>');
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: getSpecCategories(),
            boundaryGap: true,
            nameGap: 30,
            splitArea: { show: false },
            axisLabel: { formatter: '{value}' }
        },
        yAxis: {
            type: 'value',
            name: 'Unit Price ($)',
            splitArea: { show: true }
        },
        series: [{
            name: 'boxplot',
            type: 'boxplot',
            data: getBoxplotData(),
            itemStyle: {
                color: AppState.scenario === 'after' ? colors.green : colors.amber
            }
        }]
    };
    
    chart.setOption(option);
}

function updateBoxplot(chart) {
    chart.setOption({
        series: [{
            data: getBoxplotData(),
            itemStyle: {
                color: AppState.scenario === 'after' ? colors.green : colors.amber
            }
        }]
    });
}

// THESIS 4: Price Variance - Control Chart
function configureControlChart(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Unit Price', 'Target', 'Upper Control', 'Lower Control']
        },
        xAxis: {
            type: 'category',
            data: getMonthNames()
        },
        yAxis: {
            type: 'value',
            name: 'Unit Price ($)'
        },
        series: [
            {
                name: 'Unit Price',
                type: 'line',
                data: getControlChartData(),
                itemStyle: { color: colors.primary },
                lineStyle: { width: 2 }
            },
            {
                name: 'Target',
                type: 'line',
                data: getTargetLine(),
                itemStyle: { color: colors.green },
                lineStyle: { type: 'dashed' }
            },
            {
                name: 'Upper Control',
                type: 'line',
                data: getUpperControlLine(),
                itemStyle: { color: colors.amber },
                lineStyle: { type: 'dotted' }
            },
            {
                name: 'Lower Control',
                type: 'line',
                data: getLowerControlLine(),
                itemStyle: { color: colors.amber },
                lineStyle: { type: 'dotted' }
            }
        ]
    };
    
    chart.setOption(option);
}

function updateControlChart(chart) {
    chart.setOption({
        series: [
            { data: getControlChartData() },
            { data: getTargetLine() },
            { data: getUpperControlLine() },
            { data: getLowerControlLine() }
        ]
    });
}

// THESIS 5: Working Capital - Histogram
function configureHistogram(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Before', 'After']
        },
        xAxis: {
            type: 'category',
            data: getTermsBins(),
            name: 'Payment Terms (Days)'
        },
        yAxis: {
            type: 'value',
            name: 'Number of Suppliers'
        },
        series: [
            {
                name: 'Before',
                type: 'bar',
                data: getHistogramBefore(),
                itemStyle: { 
                    color: colors.amber,
                    opacity: 0.7
                }
            },
            {
                name: 'After',
                type: 'bar',
                data: getHistogramAfter(),
                itemStyle: { 
                    color: colors.green,
                    opacity: 0.7
                }
            }
        ]
    };
    
    chart.setOption(option);
}

function updateHistogram(chart) {
    // This chart shows both scenarios
    chart.setOption({
        series: [
            { data: getHistogramBefore() },
            { data: getHistogramAfter() }
        ]
    });
}

// THESIS 5: Working Capital - Waterfall
function configureWaterfall(chart) {
    const option = {
        ...commonOptions,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                const param = params[0];
                return `${param.name}: $${Math.abs(param.value)}M`;
            }
        },
        xAxis: {
            type: 'category',
            data: getWaterfallCategories()
        },
        yAxis: {
            type: 'value',
            name: 'Impact ($M)'
        },
        series: [{
            type: 'bar',
            data: getWaterfallData(),
            itemStyle: {
                color: function(params) {
                    return params.value > 0 ? colors.green : colors.amber;
                }
            }
        }]
    };
    
    chart.setOption(option);
}

function updateWaterfall(chart) {
    chart.setOption({
        series: [{ data: getWaterfallData() }]
    });
}

// Data generation functions (mock data for demonstration)
function getConfidenceColor(confidence) {
    if (confidence >= 90) return colors.green;
    if (confidence >= 70) return colors.amber;
    return '#d73027';
}

function getSankeyNodes() {
    return [
        { name: 'North America' }, { name: 'Europe' }, { name: 'Asia Pacific' },
        { name: 'IT Services' }, { name: 'Professional Services' }, { name: 'Marketing' },
        { name: 'IBM' }, { name: 'Microsoft' }, { name: 'Accenture' }, { name: 'McKinsey' }
    ];
}

function getSankeyLinks() {
    const isAfter = AppState.scenario === 'after';
    const complexity = isAfter ? 0.6 : 1.0; // Reduced complexity after normalization
    
    return [
        { source: 'North America', target: 'IT Services', value: 25 * complexity },
        { source: 'North America', target: 'Professional Services', value: 20 * complexity },
        { source: 'Europe', target: 'IT Services', value: 15 * complexity },
        { source: 'Europe', target: 'Marketing', value: 12 * complexity },
        { source: 'Asia Pacific', target: 'Professional Services', value: 10 * complexity },
        { source: 'IT Services', target: 'IBM', value: 18 * complexity },
        { source: 'IT Services', target: 'Microsoft', value: 22 * complexity },
        { source: 'Professional Services', target: 'Accenture', value: 15 * complexity },
        { source: 'Professional Services', target: 'McKinsey', value: 15 * complexity }
    ];
}

function getSupplierNames() {
    return ['IBM', 'Microsoft', 'Accenture', 'McKinsey', 'Deloitte', 'PwC', 'Oracle', 'SAP', 'Cisco', 'Others'];
}

function getSupplierSpend() {
    return [45.2, 38.7, 22.4, 18.9, 15.6, 12.3, 9.8, 7.5, 6.2, 23.4];
}

function getCumulativePercent() {
    const spend = getSupplierSpend();
    const total = spend.reduce((sum, val) => sum + val, 0);
    let cumulative = 0;
    return spend.map(val => {
        cumulative += val;
        return (cumulative / total * 100).toFixed(1);
    });
}

function getCategoryNames() {
    return ['IT Services', 'Professional Services', 'Marketing', 'Facilities', 'Travel', 'Office Supplies'];
}

function getSupplierCountBefore() {
    return [89, 67, 45, 32, 28, 21];
}

function getSupplierCountAfter() {
    return [52, 38, 28, 19, 18, 12];
}

function getOnContractSpend() {
    const isAfter = AppState.scenario === 'after';
    const base = [28.5, 24.1, 14.2, 12.1, 11.2, 8.9];
    return base.map(val => isAfter ? val * 1.4 : val);
}

function getOffContractSpend() {
    const isAfter = AppState.scenario === 'after';
    const base = [16.7, 14.6, 8.2, 6.8, 4.4, 3.4];
    return base.map(val => isAfter ? val * 0.3 : val);
}

function getBusinessUnits() {
    return ['Corporate', 'Manufacturing', 'Sales', 'IT', 'HR', 'Finance'];
}

function getHeatmapData() {
    const isAfter = AppState.scenario === 'after';
    const categories = getCategoryNames();
    const businessUnits = getBusinessUnits();
    const data = [];
    
    categories.forEach((cat, i) => {
        businessUnits.forEach((bu, j) => {
            const baseValue = Math.random() * 25 + 5;
            const value = isAfter ? baseValue * 0.4 : baseValue;
            data.push([i, j, Math.round(value * 10) / 10]);
        });
    });
    
    return data;
}

function getSpecCategories() {
    return ['Laptops', 'Office Chairs', 'Software Licenses', 'Consulting Services', 'Marketing Materials'];
}

function getBoxplotData() {
    const isAfter = AppState.scenario === 'after';
    const variance = isAfter ? 0.4 : 1.0;
    
    return [
        [1200, 1180 * variance, 1250 * variance, 1300 * variance, 1380 * variance, 1420 * variance],
        [800, 780 * variance, 820 * variance, 850 * variance, 890 * variance, 920 * variance],
        [150, 140 * variance, 160 * variance, 175 * variance, 190 * variance, 210 * variance],
        [200, 180 * variance, 210 * variance, 225 * variance, 240 * variance, 260 * variance],
        [50, 45 * variance, 52 * variance, 58 * variance, 65 * variance, 72 * variance]
    ];
}

function getMonthNames() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

function getControlChartData() {
    const isAfter = AppState.scenario === 'after';
    const base = [125, 130, 135, 128, 142, 138, 145, 132, 129, 126, 124, 127];
    
    if (isAfter) {
        // More stable after standardization
        return base.map(val => 130 + (Math.random() - 0.5) * 8);
    }
    
    return base.map(val => val + (Math.random() - 0.5) * 25);
}

function getTargetLine() {
    return new Array(12).fill(130);
}

function getUpperControlLine() {
    return new Array(12).fill(145);
}

function getLowerControlLine() {
    return new Array(12).fill(115);
}

function getTermsBins() {
    return ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '90+'];
}

function getHistogramBefore() {
    return [45, 89, 156, 78, 34, 18, 8];
}

function getHistogramAfter() {
    return [12, 34, 89, 167, 98, 45, 23];
}

function getWaterfallCategories() {
    return ['Baseline', 'Terms Extension', 'Discount Capture', 'Penalty Reduction', 'Final Impact'];
}

function getWaterfallData() {
    return [45.2, 8.7, 3.2, 1.9, 58.9];
}