from flask import Flask, render_template, request, jsonify, redirect, url_for
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained XGBoost model
model = joblib.load('xgboost_model.pkl')

# Define the route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Define the route for the prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the user input values from the form
        depth = float(request.form['depth'])
        c = float(request.form['c'])
        phi = float(request.form['phi'])
        gamma = float(request.form['gamma'])

        # Make a prediction using the loaded model
        input_data = np.array([[depth, c, phi, gamma]])
        pl_prediction = model.predict(input_data)[0]

        # Convert prediction result to native Python type (float)
        pl_prediction = float(pl_prediction)

        # Return the prediction as JSON
        return jsonify({'pl_prediction': pl_prediction}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

## Define the route for phase 2 page
@app.route('/phase2')
def phase2():
    try:
        depth = float(request.args.get('depth', 0))
        c = float(request.args.get('c', 0))
        phi = float(request.args.get('phi', 0))
        gamma = float(request.args.get('gamma', 0))
        pl_prediction = float(request.args.get('pl_prediction', 0))

        return render_template('phase2.html', depth=depth, c=c, phi=phi, gamma=gamma, pl_prediction=pl_prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
