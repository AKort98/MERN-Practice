
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Cannot find listing'))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(404, 'Unauthorized to delete this listing'))
    }

    try {
        const deleteListing = await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json("Listing deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Cannot find listing'))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(404, 'Unauthorized to update this listing'))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,

            }

        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error)
    }



}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Cannot find listing'))
        }

        res.status(200).json(listing)
    } catch (error) {
        next(error)

    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.start) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnsihed;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] }
        }

        let type = req.query.type;
        if (!type || type === 'all') {
            type = { $in: ['rent', 'sell'] }
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        const listing = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        }).sort({ [sort]: order }).limit(limit).skip(startIndex).exec();

        res.status(200).json(listing);

    } catch (error) {
        next(error)
    }
}


