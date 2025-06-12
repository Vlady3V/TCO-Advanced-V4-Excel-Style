# TCO Advanced V4 - Total Cost of Ownership Calculator

A sophisticated web application for calculating and comparing Total Cost of Ownership (TCO) for industrial equipment with wear protection strategies. Built with React, TypeScript, and modern web technologies.

![TCO Advanced V4](https://img.shields.io/badge/version-4.0.2-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6.svg)

## 🚀 Features

### Core Functionality
- **Multi-Strategy Comparison**: Compare unlimited maintenance strategies side-by-side
- **Excel-Style Interface**: Familiar data entry with color-coded wear rates
- **Real-Time Calculations**: Instant updates as you modify parameters
- **Visual Analytics**: Interactive charts for wear progression and cost analysis

### Technical Features
- **Wear Rate Management**: 
  - Color-coded severity levels (green → yellow → orange → red)
  - Support for multiple component stages (Floor, Stage 0-4)
  - Linear wear accumulation model

- **Maintenance Scheduling**:
  - Visual timeline representation
  - Flexible intervention periods
  - Component replacement tracking
  - Sidewall/Frontwall/Rebuild options

- **Cost Analysis**:
  - Detailed cost breakdown by component
  - Labor cost calculations
  - Cumulative cost tracking
  - Cost per operating hour metrics

- **Data Management**:
  - Import/Export strategies as JSON
  - Duplicate existing strategies
  - Persistent state management

## 📊 Default Scenarios

The application comes with two pre-configured scenarios:

1. **Scenario 1 - No Stage 0 WP (Initial Install)**
   - Progressive wear plate installation
   - Lower initial cost, higher long-term maintenance

2. **Scenario 2 - 25mm Wear Plate in Stage 0**
   - Initial wear protection installed
   - Higher upfront cost, extended maintenance intervals

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Vlady3V/TCO-Advanced-V4-Excel-Style.git
cd TCO-Advanced-V4-Excel-Style

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📈 Usage Guide

### 1. Strategy Configuration
- Navigate to the **Configuration** tab
- Modify basic parameters (operating hours, floor thickness)
- Adjust wear rates for each component
- Set up maintenance interventions

### 2. Cost Structure Setup
- Input wear plate costs for different thicknesses
- Define quantities for each component
- Set labor rates and time requirements
- Configure fixed costs (sidewalls, frontwall, rebuild)

### 3. Analysis
- Switch to the **Analysis** tab to view:
  - Wear progression charts
  - Cost accumulation over time
  - Period and cumulative costs
  - Key performance metrics

### 4. Comparison
- Use the **Comparison** tab to:
  - View all strategies side-by-side
  - Compare total costs and savings
  - Analyze cost per hour trends
  - Review maintenance schedules

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── WearRateInput.tsx
│   ├── MaintenanceSchedule.tsx
│   ├── WearProgressionChart.tsx
│   ├── CostAnalysisChart.tsx
│   ├── StrategyComparison.tsx
│   └── StrategyEditor.tsx
├── data/               # Default data
│   └── defaultStrategies.ts
├── utils/              # Utility functions
│   └── calculations.ts
├── types.ts            # TypeScript definitions
└── App.tsx            # Main application
```

## 🔧 Configuration

### Wear Rates
Wear rates are measured in mm per 1000 operating hours:
- **Stage 4**: 0.12 (lowest wear)
- **Stage 3**: 0.18
- **Stage 2**: 0.36
- **Stage 1**: 0.36
- **Stage 0**: 0.45
- **Floor**: 0.45 (highest wear)

### Color Coding
- 🟢 **Green**: Low wear (≤0.12)
- 🟡 **Yellow**: Medium wear (≤0.18)
- 🟠 **Orange**: High wear (≤0.36)
- 🔴 **Red**: Very high wear (>0.36)

## 📊 Excel Compatibility

The application is designed to match Excel-based TCO calculations with:
- Same formula logic for wear accumulation
- Identical cost calculation methods
- Compatible data structure for easy migration
- Export functionality for Excel integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For questions or support, please open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Non-linear wear models
- [ ] Monte Carlo simulation for uncertainty analysis
- [ ] PDF report generation
- [ ] Real-time collaboration features
- [ ] Mobile responsive design improvements
- [ ] Integration with maintenance management systems

---

Built with ❤️ by [Vlady3V](https://github.com/Vlady3V)