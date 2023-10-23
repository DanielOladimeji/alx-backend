#!/usr/bin/env python3
'''This module returns particular pagination parameters
'''
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    '''This function returns the first and last index of a page
    '''
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return(start_index, end_index)
