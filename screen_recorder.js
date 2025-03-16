// 获取屏幕流
async function startRecording() {
    let chunks = []; // 提前声明 chunks 变量
    try {
        console.log('正在获取屏幕流...');
        document.getElementById('statusBox').textContent = '状态：正在获取屏幕流...';
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const stream = new MediaStream([...screenStream.getTracks(), ...micStream.getTracks()]);
        console.log('屏幕流获取成功:', stream);
        document.getElementById('statusBox').textContent = '状态：正在录制...';
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
            console.log('接收到数据块:', e.data);
            chunks.push(e.data);
        };

        recorder.onstop = () => {
            console.log('录制已停止，正在生成文件...');
            document.getElementById('statusBox').textContent = '状态：生成文件中...';
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            a.click();
            URL.revokeObjectURL(url);
        };

        recorder.start();
        document.getElementById('stopBtn').onclick = () => recorder.stop();
    } catch (err) {
        if (err.name === 'NotAllowedError') {
            console.error('用户拒绝了屏幕或麦克风访问请求:', err);
            document.getElementById('statusBox').textContent = '状态：用户拒绝访问';
        } else if (err.name === 'NotFoundError') {
            console.error('未找到屏幕或麦克风设备:', err);
            document.getElementById('statusBox').textContent = '状态：未找到设备';
        } else {
            console.error('发生未知错误:', err);
            document.getElementById('statusBox').textContent = '状态：发生错误';
        }
    }
}

// 页面加载时初始化录屏按钮
window.onload = () => {
    document.getElementById('recordBtn').onclick = startRecording;
};
