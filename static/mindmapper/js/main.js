document.getElementById('mindmapForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const container = document.getElementById('network');

    try {
        // Show loading state
        container.innerHTML = '<div class="loading">Generating mind map...</div>';

        const response = await fetch('/generate/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: formData
        });

        const data = await response.json();
        renderMindMap(data);

    } catch (error) {
        container.innerHTML = `<div class="error">${error.message}</div>`;
    }
});

function renderMindMap(data) {
    const container = document.getElementById('network');
    container.innerHTML = '';

    // Process nodes
    const nodes = new vis.DataSet(data.nodes.map(node => ({
        id: node.id,
        label: node.label,
        group: node.group,
        explanation: node.explanation,
        font: { size: node.group === 'center' ? 24 : 18 },
        shape: node.group === 'center' ? 'ellipse' : 'box',
        color: getNodeColor(node.group)
    })));

    // Process edges
    const edges = new vis.DataSet(data.edges);

    // Network configuration
    const options = {
        nodes: {
            borderWidth: 2,
            margin: 15,
            shadow: true,
            widthConstraint: { maximum: 200 }
        },
        edges: {
            smooth: { type: 'cubicBezier' },
            arrows: 'to'
        },
        physics: {
            stabilization: true,
            barnesHut: {
                gravitationalConstant: -3000,
                springLength: 200
            }
        },
        interaction: {
            hover: true
        }
    };

    // Create network
    const network = new vis.Network(container, { nodes, edges }, options);

    // Click handler for nodes
    network.on('click', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = nodes.get(nodeId);
            showExplanation(node);
        }
    });

    // Double-click to center view
    network.on('doubleClick', () => {
        network.fit();
    });
}

function showExplanation(node) {
    console.log('Showing explanation for:', node);
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('nodeTitle');
    const explanation = document.getElementById('nodeExplanation');

    if (!node.explanation) {
        console.warn('No explanation found for node:', node);
        node.explanation = "Explanation not available";
    }

    title.textContent = node.label;
    explanation.textContent = node.explanation;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('explanationModal').style.display = 'none';
}

// Update the window click handler
window.onclick = function(event) {
    const modal = document.getElementById('explanationModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Helper functions
function getNodeColor(group) {
    const colors = {
        center: { background: '#ff7675', border: '#d63031' },
        main: { background: '#74b9ff', border: '#0984e3' },
        sub: { background: '#81ecec', border: '#00cec9' }
    };
    return colors[group] || { background: '#ddd', border: '#999' };
}
function showError(message) {
    const container = document.getElementById('network');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;  // Use textContent instead of innerHTML
    container.replaceChildren(errorDiv);
}

// Secure node content rendering
function sanitizeNodeContent(content) {
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;  // Automatic HTML escaping
}

// Event listener for modal close
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal-close').addEventListener('click', closeModal);
});