document.getElementById('mindmapForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Generating...';

        const response = await fetch('/generate/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate mind map');
        }

        const data = await response.json();

        // Clear previous network
        const container = document.getElementById('network');
        container.innerHTML = '';

        // Create new network
        const options = {
    nodes: {
        shape: 'box',
        font: {
            size: 16,
            face: 'Arial',
        },
        margin: 15,
        widthConstraint: {
            maximum: 200
        },
        color: {
            background: {
                center: '#FF6B6B',
                main: '#4ECDC4',
                sub: '#45B7D1'
            }[group],
            border: '#2B2B2B',
            highlight: {
                background: {
                    center: '#FF8787',
                    main: '#6ED7CF',
                    sub: '#5FC7E1'
                }[group],
                border: '#2B2B2B'
            }
        }
    },
    edges: {
        color: '#7E8AA2',
        smooth: {
            type: 'continuous',
            roundness: 0.5
        },
        arrows: {
            to: { enabled: true, scaleFactor: 0.5 }
        }
    },
    layout: {
        improvedLayout: false
    },
    physics: {
        enabled: true,
        stabilization: true,
        barnesHut: {
            gravitationalConstant: -5000,
            springLength: 200,
            springConstant: 0.04
        }
    },
    interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true
    }
};

        new vis.Network(container, data, options);

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Generate';
    }
});