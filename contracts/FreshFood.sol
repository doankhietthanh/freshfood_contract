// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Owner {
    string name;
    string description;
}

struct Log {
    string url;
    string hash;
    string location; //syntax: lat_long
}

struct Product {
    uint256 productId;
    string name;
    string origin;
    Owner[] ownerList;
    Log[] logList;
}

contract FreshFood is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("FreshFood", "FRF") {}

    mapping(uint256 => Product) public products;
    mapping(address => Owner) public owners;

    function addProduct(string memory _name, string memory _origin) public {
        require(
            bytes(owners[msg.sender].name).length != 0,
            "You must register as owner first"
        );

        uint256 _productId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        Product storage newProduct = products[_productId];
        newProduct.productId = _productId;
        newProduct.name = _name;
        newProduct.origin = _origin;

        string memory ownerName = getOwnerByAddress(msg.sender).name;
        string memory ownerDecs = getOwnerByAddress(msg.sender).description;

        newProduct.ownerList.push(Owner(ownerName, ownerDecs));
        newProduct.logList.push(Log("create", "create", "create"));

        _safeMint(msg.sender, _productId);
    }

    function getProduct(
        uint256 _productId
    ) public view returns (Product memory) {
        return products[_productId];
    }

    function getProducts() public view returns (Product[] memory) {
        Product[] memory _products = new Product[](_tokenIdCounter.current());
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            _products[i] = products[i];
        }
        return _products;
    }

    function getProductByOwner(
        address _ownerAddr
    ) public view returns (Product[] memory) {
        Product[] memory _products = new Product[](_tokenIdCounter.current());
        uint256 _count = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == _ownerAddr) {
                _products[_count] = products[i];
                _count++;
            }
        }
        Product[] memory _products2 = new Product[](_count);
        for (uint256 i = 0; i < _count; i++) {
            _products2[i] = _products[i];
        }
        return _products2;
    }

    function registerOwner(
        string memory _name,
        string memory _description
    ) public returns (Owner memory) {
        Owner memory _owner = Owner(_name, _description);
        owners[msg.sender] = _owner;
        return _owner;
    }

    function getOwner() public view returns (Owner memory) {
        return owners[msg.sender];
    }

    function getOwnerByAddress(
        address _ownerAddr
    ) public view returns (Owner memory) {
        return owners[_ownerAddr];
    }

    function getOwnerListFromProduct(
        uint256 _productId
    ) public view returns (Owner[] memory) {
        return products[_productId].ownerList;
    }

    function addLog(
        uint256 _productId,
        string memory _url,
        string memory _hash,
        string memory _location
    ) public {
        require(
            ownerOf(_productId) == msg.sender,
            "You are not the owner of this product"
        );
        Log memory _log = Log(_url, _hash, _location);
        products[_productId].logList.push(_log);
    }

    function transferProduct(uint256 _productId, address _newOwner) public {
        require(
            bytes(owners[_newOwner].name).length != 0,
            "New owner must register"
        );

        require(
            ownerOf(_productId) == msg.sender,
            "You are not the owner of this product"
        );

        string memory newOwnerName = getOwnerByAddress(_newOwner).name;
        string memory newOwnerDesc = getOwnerByAddress(_newOwner).description;

        products[_productId].ownerList.push(Owner(newOwnerName, newOwnerDesc));
        products[_productId].logList.push(
            Log("transfer", "transfer", "transfer")
        );

        _transfer(ownerOf(_productId), _newOwner, _productId);
    }

    function getLogs(uint256 _productId) public view returns (Log[] memory) {
        return products[_productId].logList;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
