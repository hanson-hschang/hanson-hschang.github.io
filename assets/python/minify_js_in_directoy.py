import os
import jsmin

def minify_js_in_directory(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith('.js'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename.replace('.js', '.min.js'))

            with open(input_path, 'r') as input_file:
                js = input_file.read()
            
            minified = jsmin.jsmin(js)
            
            with open(output_path, 'w') as output_file:
                output_file.write(minified)

            print(f"Minified {filename}")

# Usage
minify_js_in_directory('js_files', 'minified_js_files')