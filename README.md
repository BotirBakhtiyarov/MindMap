# AI Mind Map Generator

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Django Version](https://img.shields.io/badge/django-5.0-brightgreen)](https://www.djangoproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intelligent web application that transforms complex questions into interactive visual mind maps using AI (Deepseek integration).

![Mind Map Example](screenshots/interface.png)

## Features

- **AI-Powered Generation**: Convert natural language questions into structured mind maps
- **Interactive Visualization**: 
  - Zoomable/draggable nodes
  - Click-to-reveal explanations
  - Hierarchical organization
- **Real-time Processing**: Instant generation with loading states
- **Smart Explanations**: Context-aware node descriptions
- **Responsive Design**: Works on desktop and mobile devices
- **Export Capabilities**: PNG/PDF export (coming soon)

## Tech Stack

**Backend**  
- Django 5.0
- Deepseek API

**Frontend**  
- Vis.js (Network visualization)
- Vanilla JavaScript (ES6+)
- Tailwind CSS
- HTML5 Canvas

## Getting Started

### Prerequisites

- Python 3.10+
- Deepseek API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BotirBakhtiyarov/MindMap.git
cd MindMap
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start development server:
```bash
python manage.py runserver
```

## Configuration

1. Obtain Deepseek API key from [Deepseek Console](https://platform.deepseek.com/)
2. Update `.env` file:
```ini
DEBUG=True
DEEPSEEK_API_KEY=your_api_key_here
```

## Usage

1. Access the application at `http://localhost:8000`
2. Enter your question in the input field
3. Click "Generate" to create your mind map
4. Interact with nodes:
   - Click nodes to view explanations
   - Drag to rearrange
   - Scroll to zoom
   - Double-click to reset view

## Screenshots

| Generation Interface                      | Node Explanation                            |
|-------------------------------------------|---------------------------------------------|
| ![Interface](screenshots/interface.png) | ![Explanation](screenshots/detailing.png) |

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Deepseek](https://deepseek.com/) for AI capabilities
- [Vis.js](https://visjs.org/) for network visualization


---

**MindMap Generator** © 2025 - Transform your thoughts into visual knowledge maps
