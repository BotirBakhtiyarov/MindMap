// static/mindmapper/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    // History Management
    let searchHistory = JSON.parse(localStorage.getItem('mindmapHistory') || '[]');
    const historyList = document.getElementById('historyList');

    function updateHistory(question) {
        if (!searchHistory.includes(question)) {
            searchHistory = [question, ...searchHistory].slice(0, 10);
            localStorage.setItem('mindmapHistory', JSON.stringify(searchHistory));
            renderHistory();
        }
    }

    function renderHistory() {
        historyList.innerHTML = searchHistory.map(item => `
            <div class="history-item p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                ${item}
            </div>
        `).join('');

        // Add click handlers to all history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const question = item.textContent.trim();
                handleHistorySearch(question);
            });
        });
    }
    renderHistory();

    function handleHistorySearch(question) {
        const input = document.querySelector('input[name="question"]');
        input.value = question;

        // Trigger search
        const form = document.getElementById('mindmapForm');
        if (form) {
            const event = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            form.dispatchEvent(event);
        }
    }

    // Network Visualization
    let network = null;

    function renderMindMap(data) {
        const container = document.getElementById('network');
        const options = {
            nodes: {
                borderWidth: 2,
                shape: 'box',
                font: {
                    size: 16,
                    face: 'Inter, sans-serif'
                },
                color: {
                    background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9',
                    border: document.documentElement.classList.contains('dark') ? '#475569' : '#cbd5e1',
                    highlight: {
                        background: '#6366f1',
                        border: '#4338ca'
                    }
                }
            },
            edges: {
                smooth: true,
                color: document.documentElement.classList.contains('dark') ? '#475569' : '#cbd5e1',
                arrows: 'to',
                width: 2
            },
            physics: {
                stabilization: true,
                barnesHut: {
                    springLength: 200
                }
            },
            interaction: {
                hover: true
            }
        };

        network = new vis.Network(container, data, options);

        network.on('click', (params) => {
            if (params.nodes.length) {
                const node = data.nodes.get(params.nodes[0]);
                showExplanation(node);
            }
        });
    }

    // Form Handling
    document.getElementById('mindmapForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const container = document.getElementById('network');
        if (network) {
            network.destroy();
            container.innerHTML = '';
        }
        const formData = new FormData(e.target);
        const question = formData.get('question').trim();

        if (!question) return;

        try {
            document.getElementById('loadingOverlay').classList.remove('hidden');
            const response = await fetch('/generate/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: formData
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            updateHistory(question);
            renderMindMap({
                nodes: new vis.DataSet(data.nodes),
                edges: new vis.DataSet(data.edges)
            });
        } catch (error) {
            showError('Failed to generate mind map. Please try again.');
        } finally {
            document.getElementById('loadingOverlay').classList.add('hidden');
        }
    });

    const explanationModal = document.getElementById('explanationModal');
    const modalContent = explanationModal.querySelector('.modal-content');
    // Modal Handling
        function showExplanation(node) {
            document.getElementById('nodeTitle').textContent = node.label;
            document.getElementById('nodeExplanation').textContent = node.explanation;

            explanationModal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);
        }

        function closeExplanationModal() {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                explanationModal.classList.add('hidden');
            }, 200);
        }

        explanationModal.addEventListener('click', (e) => {
            if (e.target === explanationModal || e.target.closest('button')) {
                closeExplanationModal();
            }
        });

    document.getElementById('explanationModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.closest('button')) {
            const content = document.querySelector('.modal-content');
            content.style.opacity = '0';
            content.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                e.currentTarget.classList.add('hidden');
            }, 200);
        }
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
});