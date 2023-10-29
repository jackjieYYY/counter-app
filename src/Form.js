import React, { useState, useEffect } from 'react';

function Form() {
    const [result, setResult] = useState({})
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // 创建新的 <script> 标签
        const script = document.createElement('script');

        // 设置必要的属性
        script.src = 'https://www.recaptcha.net/recaptcha/api.js?render=6LfrMU0mAAAAADoo9vRBTLwrt5mU0HvykuR3l8uN';
        script.async = true;
        script.defer = true;

        // 插入新的 <script> 标签到 <head>
        document.head.appendChild(script);

        // 在脚本加载完成后设置状态
        script.onload = () => {
            setScriptLoaded(true);
        };

        // 在组件卸载时移除 <script> 标签
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 只有当 grecaptcha 脚本已加载时才执行
        if (scriptLoaded) {
            window.grecaptcha.ready(async () => {
                try {
                    const recaptchaToken = await window.grecaptcha.execute('6LfrMU0mAAAAADoo9vRBTLwrt5mU0HvykuR3l8uN', { action: 'your_customer_action' });
                    console.log("your recaptchaToken:", recaptchaToken);
                    const response = await fetch('https://recaptcha.arknights.host/validate_recaptcha', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ recaptcha_response: recaptchaToken })
                    });

                    const data = await response.json();
                    setResult(data)
                    // 这里你可以处理后端返回的响应
                    console.log(data);

                } catch (error) {

                }

            });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button type="submit">提交</button>
            <p>点击上方按钮进行测试recaptcha</p>
            <p> 后端检测结果: {JSON.stringify(result)}</p>
        </form>
    );
}
export default Form;
