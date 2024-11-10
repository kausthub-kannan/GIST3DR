from supabase import Client


def check_file_exists(supabase: Client, bucket_name: str, file_path: str) -> bool:
    """
    Check if a file exists in Supabase Storage.

    Args:
        bucket_name (str): Name of the storage bucket
        file_path (str): Path to the file within the bucket

    Returns:
        bool: True if file exists, False otherwise
    """
    try:
        response = supabase.storage.from_(bucket_name).list(
            file_path.rsplit("/", 1)[0] if "/" in file_path else ""
        )
        file_name = file_path.split("/")[-1]
        return any(item["name"] == file_name for item in response)
    except Exception as e:
        print(f"Error checking file: {str(e)}")
        return False
