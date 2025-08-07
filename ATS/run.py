from app import create_app

# Create the app using your factory function
app = create_app()

if __name__ == '__main__':
    # Enable dev mode features
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True,       # Enables debugger and reloader
        use_reloader=True # Auto-restarts on file changes
    )
