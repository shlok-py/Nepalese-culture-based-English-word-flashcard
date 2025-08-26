# import os
# from fastapi import APIRouter, HTTPException, Response
# from fastapi.responses import FileResponse

# router = APIRouter(prefix="/api", tags=["images"])

# @router.post("/image/{filename}")
# def get_image(filename: str):
#     """
#     Serves an image file from the data/images directory.

#     Args:
#         filename (str): The name of the image file.

#     Returns:
#         FileResponse: The image file as a response.

#     Raises:
#         HTTPException: If the image file does not exist.
#     """
#     # Debug: Print the received filename
#     print(f"Requested filename: {filename}")

#     # Use os.path.join for cross-platform compatibility
#     image_dir = os.path.join("..","backend", "data", "images")
#     image_path = os.path.join(image_dir, f"{filename}.png")

#     # Debug: Print the constructed image path
#     print(f"Constructed image path: {image_path}")

#     # Debug: Print absolute path
#     abs_image_path = os.path.abspath(image_path)
#     print(f"Absolute image path: {abs_image_path}")

#     if not os.path.isfile(image_path):
#         print(f"File not found: {image_path}")
#         raise HTTPException(status_code=404, detail=f"Image file '{filename}' not found in data/images.")

#     import base64
#     try:
#         with open(image_path, "rb") as image_file:
#             image_bytes = image_file.read()
#             print(f"Read {len(image_bytes)} bytes from image file.")
#             encoded_string = base64.b64encode(image_bytes).decode("utf-8")
#     except Exception as e:
#         print(f"Error reading or encoding image: {e}")
#         raise HTTPException(status_code=500, detail="Error reading image file.")

#     # Debug: Print a snippet of the encoded string
#     print(f"Encoded string (first 100 chars): {encoded_string[:100]}")

#     return {"filename": filename, "data": encoded_string}

import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/api", tags=["images"])

@router.post("/image/{filename}")
def get_image(filename: str):
    """
    Serves an image file from the data/images directory.

    Args:
        filename (str): The name of the image file.

    Returns:
        FileResponse: The image file as a response.

    Raises:
        HTTPException: If the image file does not exist.
    """
    image_dir = os.path.join("..", "backend", "data", "images")
    image_path = os.path.join(image_dir, f"{filename}.png")  # Assuming PNG images

    if not os.path.isfile(image_path):
        raise HTTPException(status_code=404, detail=f"Image '{filename}' not found.")

    return FileResponse(image_path, media_type="image/png")
