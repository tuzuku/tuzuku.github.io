// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.nav-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add scroll effect to navigation
    let lastScroll = 0;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe blog cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Button ripple effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Generate table of contents for post pages
    const postToc = document.getElementById('post-toc');
    const postContent = document.querySelector('.post-content');
    
    if (postToc && postContent) {
        const headings = postContent.querySelectorAll('h2, h3, h4');
        const tocItems = [];
        const existingIds = new Set();
        
        // 收集所有现有ID
        document.querySelectorAll('[id]').forEach(el => {
            if (el.id) existingIds.add(el.id);
        });
        
        headings.forEach((heading, index) => {
            // 为标题添加ID
            let id = heading.id;
            if (!id || existingIds.has(id)) {
                // 从标题文本生成一个合适的ID
                const text = heading.textContent.trim();
                id = 'heading-' + text.toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、连字符
                    .replace(/\s+/g, '-') // 空格替换为连字符
                    .replace(/-+/g, '-') // 多个连字符合并为一个
                    .replace(/^-|-$/g, '') // 移除首尾连字符
                    .substring(0, 50); // 限制长度
                
                if (!id) id = 'heading-' + index;
                
                // 确保ID唯一
                let uniqueId = id;
                let counter = 1;
                while (existingIds.has(uniqueId)) {
                    uniqueId = id + '-' + counter;
                    counter++;
                }
                id = uniqueId;
                heading.id = id;
                existingIds.add(id);
            }
            
            // 创建目录项
            const level = parseInt(heading.tagName.charAt(1)); // h2 -> 2, h3 -> 3, etc.
            tocItems.push({
                id: id,
                text: heading.textContent.trim(),
                level: level
            });
        });
        
        // 生成目录HTML
        if (tocItems.length > 0) {
            let tocHtml = '';
            tocItems.forEach(item => {
                const indent = item.level > 2 ? 'padding-left: ' + ((item.level - 2) * 16) + 'px;' : '';
                tocHtml += `<a href="#${item.id}" class="sidebar-link toc-link" data-id="${item.id}" style="${indent}">${item.text}</a>`;
            });
            postToc.innerHTML = tocHtml;
            
            // 平滑滚动
            postToc.querySelectorAll('.toc-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        // 更新active状态
                        postToc.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            });
            
            // 监听滚动，高亮当前章节
            const observerOptions = {
                rootMargin: '-120px 0px -60% 0px',
                threshold: [0, 0.1, 0.5, 1]
            };
            
            let activeHeading = null;
            
            const tocObserver = new IntersectionObserver(function(entries) {
                // 找到最接近顶部的可见标题
                const visibleHeadings = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => {
                        const aTop = a.boundingClientRect.top;
                        const bTop = b.boundingClientRect.top;
                        return Math.abs(aTop - 120) - Math.abs(bTop - 120);
                    });
                
                if (visibleHeadings.length > 0) {
                    const newActiveHeading = visibleHeadings[0].target;
                    if (newActiveHeading !== activeHeading) {
                        activeHeading = newActiveHeading;
                        const id = newActiveHeading.id;
                        const tocLink = postToc.querySelector(`.toc-link[data-id="${id}"]`);
                        
                        if (tocLink) {
                            // 移除所有active类
                            postToc.querySelectorAll('.toc-link').forEach(link => {
                                link.classList.remove('active');
                            });
                            // 添加active类到当前链接
                            tocLink.classList.add('active');
                        }
                    }
                }
            }, observerOptions);
            
            // 观察所有标题
            headings.forEach(heading => {
                if (heading.id) {
                    tocObserver.observe(heading);
                }
            });
            
            // 初始化：高亮第一个标题（如果页面顶部）
            if (window.pageYOffset < 100 && tocItems.length > 0) {
                const firstLink = postToc.querySelector('.toc-link');
                if (firstLink) {
                    firstLink.classList.add('active');
                }
            }
        } else {
            postToc.innerHTML = '<p style="color: var(--md-sys-color-on-surface-variant); font-size: 0.875rem; padding: var(--md-sys-spacing-2) var(--md-sys-spacing-3);">暂无目录</p>';
        }
    }
    
    // 为代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('.post-content pre');
    codeBlocks.forEach((preBlock, index) => {
        // 检查是否已经有复制按钮
        if (preBlock.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }
        
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        
        // 获取代码内容
        const codeElement = preBlock.querySelector('code');
        const getCodeText = () => {
            if (codeElement) {
                return codeElement.textContent || codeElement.innerText;
            }
            return preBlock.textContent || preBlock.innerText;
        };
        
        // 复制功能
        copyButton.addEventListener('click', async function() {
            const codeText = getCodeText();
            try {
                await navigator.clipboard.writeText(codeText);
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            } catch (err) {
                // 降级方案：使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.classList.add('copied');
                    
                    setTimeout(() => {
                        this.classList.remove('copied');
                    }, 2000);
                } catch (e) {
                    console.error('复制失败:', e);
                }
                document.body.removeChild(textArea);
            }
        });
        
        // 包装代码块
        preBlock.parentNode.insertBefore(wrapper, preBlock);
        wrapper.appendChild(preBlock);
        wrapper.appendChild(copyButton);
    });
});
